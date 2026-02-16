# C# Best Practices Reference

Project structure, dependency injection, and configuration patterns.

## References

- [**Project Structure**](project-structure.md) - Clean Architecture layout.
- [**DI Lifetimes**](di-lifetimes.md) - Transient, Scoped, Singleton comparison.
- [**Logging**](logging.md) - Structured logging best practices.

## Project Structure (Clean Architecture)

```
src/
├── Domain/                        # Core business logic (no dependencies)
│   ├── Entities/
│   │   ├── User.cs
│   │   └── Order.cs
│   ├── ValueObjects/
│   │   └── Money.cs
│   ├── Enums/
│   │   └── OrderStatus.cs
│   └── Interfaces/
│       ├── IUserRepository.cs
│       └── IOrderRepository.cs
│
├── Application/                   # Use cases (depends on Domain)
│   ├── Common/
│   │   ├── Interfaces/
│   │   │   └── IEmailService.cs
│   │   └── Behaviors/
│   │       └── ValidationBehavior.cs
│   ├── Users/
│   │   ├── Commands/
│   │   │   └── CreateUserCommand.cs
│   │   └── Queries/
│   │       └── GetUserQuery.cs
│   └── DependencyInjection.cs
│
├── Infrastructure/                # External concerns (DB, Email, etc.)
│   ├── Data/
│   │   ├── AppDbContext.cs
│   │   └── Repositories/
│   │       └── UserRepository.cs
│   ├── Services/
│   │   └── EmailService.cs
│   └── DependencyInjection.cs
│
└── WebApi/                        # Presentation layer
    ├── Controllers/
    │   └── UsersController.cs
    ├── Middleware/
    │   └── ExceptionMiddleware.cs
    └── Program.cs
```

## DI Lifetime Comparison

| Lifetime | Created | Disposed | Use Case |
|----------|---------|----------|----------|
| **Transient** | Every request | After use | Lightweight, stateless services |
| **Scoped** | Once per HTTP request | End of request | DbContext, UnitOfWork |
| **Singleton** | Once per app | App shutdown | Caches, HttpClientFactory |

```csharp
// Registration examples
services.AddTransient<IEmailSender, EmailSender>();      // New instance each time
services.AddScoped<IUserRepository, UserRepository>();   // Per HTTP request
services.AddSingleton<ICacheService, MemoryCacheService>(); // App lifetime

// Common mistake: Scoped in Singleton (captive dependency)
// ❌ DON'T: Singleton depending on Scoped
public class SingletonService(IScopedService scoped) { } // Runtime error!

// ✅ DO: Use IServiceScopeFactory for scoped in singleton
public class SingletonService(IServiceScopeFactory scopeFactory)
{
    public async Task DoWork()
    {
        using var scope = scopeFactory.CreateScope();
        var scoped = scope.ServiceProvider.GetRequiredService<IScopedService>();
        await scoped.ProcessAsync();
    }
}
```

## Logging Best Practices

```csharp
// Log levels usage
public class OrderProcessor(ILogger<OrderProcessor> logger)
{
    public async Task ProcessAsync(Order order)
    {
        // Trace: Very detailed, only for debugging specific issues
        logger.LogTrace("Processing order with data: {@Order}", order);

        // Debug: Development diagnostics
        logger.LogDebug("Starting order processing for {OrderId}", order.Id);

        // Information: Normal operation milestones
        logger.LogInformation("Order {OrderId} processed successfully", order.Id);

        // Warning: Unexpected but handled situations
        if (order.Items.Count == 0)
            logger.LogWarning("Order {OrderId} has no items", order.Id);

        // Error: Failures that need attention
        try { await SendEmailAsync(order); }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to send email for order {OrderId}", order.Id);
        }

        // Critical: App-breaking failures
        // logger.LogCritical("Database connection lost");
    }
}

// High-performance logging with source generators
public static partial class LogMessages
{
    [LoggerMessage(Level = LogLevel.Information, Message = "Order {OrderId} created by {UserId}")]
    public static partial void OrderCreated(this ILogger logger, int orderId, int userId);

    [LoggerMessage(Level = LogLevel.Error, Message = "Payment failed for order {OrderId}")]
    public static partial void PaymentFailed(this ILogger logger, int orderId, Exception ex);
}

// Usage
logger.OrderCreated(order.Id, user.Id);
```

## Configuration Patterns

```csharp
// appsettings.json structure
{
  "Database": {
    "ConnectionString": "...",
    "CommandTimeout": 30
  },
  "Email": {
    "SmtpHost": "smtp.example.com",
    "SmtpPort": 587,
    "FromAddress": "noreply@example.com"
  },
  "Features": {
    "EnableNewDashboard": true
  }
}

// Strongly-typed options
public class DatabaseSettings
{
    public const string SectionName = "Database";

    [Required]
    public string ConnectionString { get; init; } = string.Empty;

    [Range(1, 300)]
    public int CommandTimeout { get; init; } = 30;
}

// Registration with validation
builder.Services.AddOptions<DatabaseSettings>()
    .BindConfiguration(DatabaseSettings.SectionName)
    .ValidateDataAnnotations()
    .ValidateOnStart(); // Fail fast at startup

// Usage patterns
public class DataService(IOptions<DatabaseSettings> options)
{
    // IOptions<T> - Singleton, read once at startup
    private readonly DatabaseSettings _settings = options.Value;
}

public class FeatureService(IOptionsSnapshot<DatabaseSettings> options)
{
    // IOptionsSnapshot<T> - Scoped, re-reads on each request
    public void DoWork() => Console.WriteLine(options.Value.CommandTimeout);
}

public class BackgroundService(IOptionsMonitor<DatabaseSettings> options)
{
    // IOptionsMonitor<T> - Singleton with change notifications
    public BackgroundService()
    {
        options.OnChange(settings => Console.WriteLine("Config changed!"));
    }
}
```

## Extension Method Patterns

```csharp
// Service registration extensions
public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // Database
        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("Default")));

        // Repositories
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IOrderRepository, OrderRepository>();

        // External services
        services.AddHttpClient<IPaymentClient, PaymentClient>(client =>
        {
            client.BaseAddress = new Uri(configuration["Payment:BaseUrl"]!);
            client.Timeout = TimeSpan.FromSeconds(30);
        });

        return services;
    }
}

// Usage in Program.cs
builder.Services
    .AddInfrastructure(builder.Configuration)
    .AddApplication();
```

## Naming Convention Examples

```csharp
// ✅ Correct naming
public interface IUserRepository { }           // Interface: IPascalCase
public class UserRepository : IUserRepository  // Class: PascalCase
{
    private readonly DbContext _context;       // Private field: _camelCase
    private readonly ILogger<UserRepository> _logger;

    public string ConnectionString { get; }    // Property: PascalCase
    public event EventHandler? UserCreated;    // Event: PascalCase

    public async Task<User?> GetByIdAsync(     // Method: PascalCase
        int userId,                            // Parameter: camelCase
        CancellationToken cancellationToken)
    {
        var user = await _context.Users        // Local: camelCase
            .FindAsync(userId, cancellationToken);
        return user;
    }
}

public class Repository<TEntity>               // Type parameter: TPascalCase
    where TEntity : class { }

public const string DefaultRole = "User";      // Constant: PascalCase
```
