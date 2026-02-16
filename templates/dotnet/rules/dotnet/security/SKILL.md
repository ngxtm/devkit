---
name: .NET Security
description: Security standards for .NET applications based on OWASP guidelines.
metadata:
  labels: [security, auth, owasp, dotnet]
  triggers:
    files: ['**/*.cs', '**/appsettings*.json']
    keywords: [Authorize, Authentication, Identity, JWT, CORS, password]
---

# .NET Security

## **Priority: P0 (CRITICAL)**

Security standards for .NET applications based on OWASP guidelines.

## Implementation Guidelines

- **Authentication**: ASP.NET Identity for users, JWT Bearer for APIs, Cookie auth for web apps.
- **Authorization**: Policy-based over role-based. Resource-based for fine-grained control.
- **Input Validation**: `FluentValidation` or `DataAnnotations`. Validate at API boundaries.
- **SQL Injection**: Always use parameterized queries. EF Core and Dapper handle this automatically.
- **XSS Prevention**: Razor auto-encodes by default. Use `HtmlEncoder` for manual encoding.
- **CSRF**: Anti-forgery tokens for forms. `SameSite=Strict` cookies.
- **Secrets**: Never hardcode. Use User Secrets (dev), Azure Key Vault (prod).
- **HTTPS**: Always `UseHttpsRedirection()`. Enable HSTS in production.
- **Headers**: Use security headers middleware (CSP, X-Frame-Options, etc.).
- **Rate Limiting**: Use built-in `RateLimiter` middleware (.NET 7+).

## Anti-Patterns

- **No hardcoded secrets**: Never commit API keys, connection strings, passwords.
- **No `[AllowAnonymous]` on sensitive endpoints**: Review all anonymous access.
- **No raw SQL with interpolation**: `$"SELECT * FROM Users WHERE Id = {id}"` is vulnerable.
- **No `*` CORS in production**: Specify allowed origins explicitly.
- **No disabled SSL validation**: Never `ServerCertificateCustomValidationCallback = (_, _, _, _) => true`.

## Code

```csharp
// JWT Bearer configuration
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

// Policy-based authorization
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("CanEditOrder", policy =>
        policy.Requirements.Add(new ResourceOwnerRequirement()));
});

// Parameterized query (safe from SQL injection)
var user = await connection.QuerySingleAsync<User>(
    "SELECT * FROM Users WHERE Id = @Id AND Status = @Status",
    new { Id = userId, Status = "Active" });

// Rate limiting
builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("api", cfg =>
    {
        cfg.Window = TimeSpan.FromMinutes(1);
        cfg.PermitLimit = 100;
    });
});
```

## Reference & Examples

For JWT patterns, Identity configuration, and security headers:
See [references/REFERENCE.md](references/REFERENCE.md).

## Related Topics

language | best-practices | aspnet-core
