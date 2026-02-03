---
name: C# Language Patterns
description: Modern C# standards for type safety, performance, and maintainability.
metadata:
  labels: [csharp, dotnet, language, types, async]
  triggers:
    files: ['**/*.cs', '**/*.csproj']
    keywords: [class, record, interface, async, await, linq, nullable, span]
---

# C# Language Patterns

## **Priority: P0 (CRITICAL)**

Modern C# standards for type-safe, performant, maintainable code.

## Implementation Guidelines

- **Nullable Reference Types**: Enable `<Nullable>enable</Nullable>`. Use `?` for nullable, avoid `!` except when compiler can't infer.
- **Records**: `record` for immutable DTOs, `record struct` for stack-allocated value types.
- **Pattern Matching**: `is` patterns, `switch` expressions, property/positional patterns.
- **Async/Await**: Always use `CancellationToken`. `ValueTask` for hot paths. `ConfigureAwait(false)` in libraries.
- **LINQ**: Prefer method syntax. Avoid multiple enumerations (`ToList()` once). Use `AsNoTracking()` for read-only EF queries.
- **Generics**: Constraints (`where T : class, new()`), covariance (`out T`), contravariance (`in T`).
- **Spans**: `Span<T>`, `ReadOnlySpan<T>` for zero-allocation slicing.
- **Primary Constructors**: C# 12+ `class Foo(int x)` for concise DI.
- **Collection Expressions**: C# 12+ `[1, 2, 3]` syntax.
- **Raw String Literals**: `"""multi-line"""` for SQL, JSON templates.

## Anti-Patterns

- **No `async void`**: Use `async Task`. Exception: event handlers.
- **No `Task.Result`/`.Wait()`**: Deadlock risk. Always `await`.
- **No `DateTime.Now`**: Use `DateTimeOffset.UtcNow` for timezone safety.
- **No string concat in loops**: Use `StringBuilder` or `string.Join`.
- **No `!` abuse**: Prefer null checks or `??` over null-forgiving.

## Code

```csharp
// Record with primary constructor
public record UserDto(string Name, string Email);

// Pattern matching with switch expression
string GetStatus(Order order) => order switch
{
    { Status: OrderStatus.Pending } => "Waiting",
    { Status: OrderStatus.Shipped, TrackingNumber: not null } => "In Transit",
    { IsCancelled: true } => "Cancelled",
    _ => "Unknown"
};

// Async with cancellation token
async Task<User?> GetUserAsync(int id, CancellationToken ct = default)
{
    return await _db.Users
        .AsNoTracking()
        .FirstOrDefaultAsync(u => u.Id == id, ct);
}

// Span for zero-allocation parsing
ReadOnlySpan<char> GetFirstWord(ReadOnlySpan<char> text)
{
    int idx = text.IndexOf(' ');
    return idx < 0 ? text : text[..idx];
}

// Primary constructor (C# 12)
public class UserService(IUserRepository repo, ILogger<UserService> logger)
{
    public async Task<User?> GetAsync(int id) => await repo.GetByIdAsync(id);
}
```

## Reference & Examples

For advanced patterns, spans, and nullable annotations:
See [references/REFERENCE.md](references/REFERENCE.md).

## Related Topics

best-practices | security | tooling
