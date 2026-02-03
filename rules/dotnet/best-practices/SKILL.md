---
name: C# Best Practices
description: Idiomatic C# patterns for clean, maintainable code.
metadata:
  labels: [csharp, conventions, naming, structure, di]
  triggers:
    files: ['**/*.cs']
    keywords: [class, namespace, using, public, private, internal]
---

# C# Best Practices

## **Priority: P1 (OPERATIONAL)**

Idiomatic patterns for clean, maintainable C# code.

## Implementation Guidelines

- **Naming Conventions**:
  - `PascalCase`: Types, methods, properties, events, namespaces
  - `camelCase`: Parameters, local variables
  - `_camelCase`: Private fields
  - `IPascalCase`: Interfaces (prefix with `I`)
  - `TPascalCase`: Type parameters (prefix with `T`)
- **Project Structure**: Clean/Onion architecture. Feature folders over layer folders.
- **Dependency Injection**: Constructor injection only. Register in `IServiceCollection`.
- **Logging**: `ILogger<T>` with structured logging. Use appropriate log levels.
- **Configuration**: `IOptions<T>` pattern with validation. Never hardcode settings.
- **File Organization**: One type per file. Use `global using` for common namespaces.
- **Immutability**: Prefer `readonly`, `init`, `record` for data integrity.
- **Expression-bodied Members**: Use for simple single-line methods/properties.

## Anti-Patterns

- **No static services**: Use DI instead of `static class ServiceHelper`.
- **No service locator**: Avoid `IServiceProvider.GetService()` in business logic.
- **No `new()` for dependencies**: Inject via constructor.
- **No magic strings**: Use `nameof()`, constants, or configuration.
- **No God classes**: Split large classes by responsibility.
- **No regions**: Use partial classes or extract types instead.

## Code

```csharp
// Proper DI registration
public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IOrderService, OrderService>();

        services.AddOptions<EmailSettings>()
            .BindConfiguration("Email")
            .ValidateDataAnnotations()
            .ValidateOnStart();

        return services;
    }
}

// Structured logging with semantic names
public class OrderService(IOrderRepository repo, ILogger<OrderService> logger)
{
    public async Task<Order?> GetOrderAsync(int orderId, CancellationToken ct)
    {
        logger.LogDebug("Fetching order {OrderId}", orderId);

        var order = await repo.GetByIdAsync(orderId, ct);

        if (order is null)
            logger.LogWarning("Order {OrderId} not found", orderId);

        return order;
    }
}

// Options pattern with validation
public class EmailSettings
{
    public const string SectionName = "Email";

    [Required]
    public string SmtpHost { get; init; } = string.Empty;

    [Range(1, 65535)]
    public int SmtpPort { get; init; } = 587;

    [Required, EmailAddress]
    public string FromAddress { get; init; } = string.Empty;
}
```

## Reference & Examples

For project structure templates and DI patterns:
See [references/REFERENCE.md](references/REFERENCE.md).

## Related Topics

language | security | tooling
