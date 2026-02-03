# .NET Security Reference

Authentication, authorization, and security headers configuration.

## References

- [**JWT Authentication**](jwt-authentication.md) - Token generation and validation.
- [**Identity Configuration**](identity-configuration.md) - Password rules, lockout settings.
- [**Security Headers**](security-headers.md) - CSP, HSTS, X-Frame-Options.

## JWT Token Generation

```csharp
public class TokenService(IOptions<JwtSettings> options)
{
    private readonly JwtSettings _settings = options.Value;

    public string GenerateToken(User user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim("tenant_id", user.TenantId.ToString())
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_settings.Key));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _settings.Issuer,
            audience: _settings.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(_settings.ExpiryHours),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public ClaimsPrincipal? ValidateToken(string token)
    {
        var handler = new JwtSecurityTokenHandler();
        try
        {
            return handler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = _settings.Issuer,
                ValidAudience = _settings.Audience,
                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(_settings.Key)),
                ClockSkew = TimeSpan.Zero
            }, out _);
        }
        catch
        {
            return null;
        }
    }
}
```

## ASP.NET Identity Configuration

```csharp
// Program.cs
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    // Password requirements
    options.Password.RequiredLength = 12;
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequiredUniqueChars = 4;

    // Lockout settings
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.AllowedForNewUsers = true;

    // User settings
    options.User.RequireUniqueEmail = true;
    options.SignIn.RequireConfirmedEmail = true;
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();

// Password hasher upgrade (Argon2id recommended for new apps)
builder.Services.Configure<PasswordHasherOptions>(options =>
{
    options.IterationCount = 310000; // OWASP recommendation
});
```

## Security Headers Middleware

```csharp
// Using a middleware class
public class SecurityHeadersMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context)
    {
        // Prevent clickjacking
        context.Response.Headers.Append("X-Frame-Options", "DENY");

        // Prevent MIME sniffing
        context.Response.Headers.Append("X-Content-Type-Options", "nosniff");

        // XSS protection (legacy, CSP is better)
        context.Response.Headers.Append("X-XSS-Protection", "1; mode=block");

        // Referrer policy
        context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");

        // Content Security Policy
        context.Response.Headers.Append("Content-Security-Policy",
            "default-src 'self'; " +
            "script-src 'self' 'unsafe-inline'; " +
            "style-src 'self' 'unsafe-inline'; " +
            "img-src 'self' data: https:; " +
            "font-src 'self'; " +
            "frame-ancestors 'none';");

        // Permissions Policy
        context.Response.Headers.Append("Permissions-Policy",
            "geolocation=(), microphone=(), camera=()");

        await next(context);
    }
}

// Usage in Program.cs
app.UseMiddleware<SecurityHeadersMiddleware>();
app.UseHsts(); // Strict-Transport-Security
```

## CORS Configuration

```csharp
// Development (allow specific origins)
builder.Services.AddCors(options =>
{
    options.AddPolicy("Development", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });

    options.AddPolicy("Production", policy =>
    {
        policy.WithOrigins(
                builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()!)
              .WithHeaders("Authorization", "Content-Type", "X-Requested-With")
              .WithMethods("GET", "POST", "PUT", "DELETE")
              .AllowCredentials()
              .SetPreflightMaxAge(TimeSpan.FromMinutes(10));
    });
});

// Usage
app.UseCors(builder.Environment.IsDevelopment() ? "Development" : "Production");
```

## Resource-Based Authorization

```csharp
// Requirement
public class ResourceOwnerRequirement : IAuthorizationRequirement { }

// Handler
public class ResourceOwnerHandler : AuthorizationHandler<ResourceOwnerRequirement, Order>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        ResourceOwnerRequirement requirement,
        Order resource)
    {
        var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (resource.UserId.ToString() == userId ||
            context.User.IsInRole("Admin"))
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}

// Registration
builder.Services.AddScoped<IAuthorizationHandler, ResourceOwnerHandler>();

// Usage in controller
public async Task<IActionResult> UpdateOrder(int id, UpdateOrderDto dto)
{
    var order = await _orderService.GetByIdAsync(id);
    if (order is null) return NotFound();

    var authResult = await _authService.AuthorizeAsync(
        User, order, new ResourceOwnerRequirement());

    if (!authResult.Succeeded) return Forbid();

    await _orderService.UpdateAsync(order, dto);
    return NoContent();
}
```

## Rate Limiting (.NET 7+)

```csharp
builder.Services.AddRateLimiter(options =>
{
    // Fixed window: 100 requests per minute
    options.AddFixedWindowLimiter("fixed", cfg =>
    {
        cfg.Window = TimeSpan.FromMinutes(1);
        cfg.PermitLimit = 100;
        cfg.QueueLimit = 10;
        cfg.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
    });

    // Sliding window: smoother rate limiting
    options.AddSlidingWindowLimiter("sliding", cfg =>
    {
        cfg.Window = TimeSpan.FromMinutes(1);
        cfg.PermitLimit = 100;
        cfg.SegmentsPerWindow = 6; // 10-second segments
    });

    // Token bucket: burst allowance
    options.AddTokenBucketLimiter("token", cfg =>
    {
        cfg.TokenLimit = 100;
        cfg.ReplenishmentPeriod = TimeSpan.FromSeconds(10);
        cfg.TokensPerPeriod = 20;
    });

    // Per-user limiting
    options.AddPolicy("per-user", context =>
        RateLimitPartition.GetFixedWindowLimiter(
            context.User.Identity?.Name ?? context.Connection.RemoteIpAddress?.ToString() ?? "anonymous",
            _ => new FixedWindowRateLimiterOptions
            {
                Window = TimeSpan.FromMinutes(1),
                PermitLimit = 50
            }));

    options.OnRejected = async (context, token) =>
    {
        context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
        await context.HttpContext.Response.WriteAsJsonAsync(new
        {
            error = "Too many requests. Please try again later."
        }, token);
    };
});

// Usage
app.UseRateLimiter();

app.MapGet("/api/data", () => "Hello")
   .RequireRateLimiting("fixed");
```

## Secrets Management

```csharp
// Development: User Secrets
// dotnet user-secrets init
// dotnet user-secrets set "Database:Password" "secret123"

// Production: Azure Key Vault
builder.Configuration.AddAzureKeyVault(
    new Uri($"https://{builder.Configuration["KeyVault:Name"]}.vault.azure.net/"),
    new DefaultAzureCredential());

// Environment variables (Docker/K8s)
builder.Configuration.AddEnvironmentVariables(prefix: "APP_");

// Never do this:
// ❌ var password = "hardcoded_password";
// ❌ var connString = "Server=...;Password=secret;";

// Always do this:
// ✅ var password = builder.Configuration["Database:Password"];
// ✅ var connString = builder.Configuration.GetConnectionString("Default");
```
