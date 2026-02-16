# C# Language Patterns Reference

Advanced type patterns, spans, and modern C# features.

## References

- [**Pattern Matching**](pattern-matching.md) - Switch expressions, property patterns.
- [**Nullable Annotations**](nullable-annotations.md) - `[NotNull]`, `[MaybeNull]`, flow analysis.
- [**Spans & Memory**](spans-memory.md) - Zero-allocation patterns.

## Advanced Pattern Matching

```csharp
// List patterns (C# 11+)
int[] numbers = [1, 2, 3, 4, 5];
var result = numbers switch
{
    [1, 2, ..] => "Starts with 1, 2",
    [_, _, 3, ..] => "Third element is 3",
    { Length: > 10 } => "Long array",
    [] => "Empty",
    _ => "Other"
};

// Property patterns with nested matching
string Describe(Person person) => person switch
{
    { Name: "Admin", Role: { Permissions: { IsAdmin: true } } } => "Full access",
    { Age: >= 18, IsVerified: true } => "Verified adult",
    { Age: < 18 } => "Minor",
    _ => "Standard user"
};

// Relational patterns
string GetTaxBracket(decimal income) => income switch
{
    <= 10_000m => "0%",
    <= 50_000m => "10%",
    <= 100_000m => "20%",
    _ => "30%"
};
```

## Nullable Reference Types

```csharp
// Nullable annotations
public class UserService
{
    // Parameter never null after validation
    public User GetUser([NotNull] string? id)
    {
        ArgumentNullException.ThrowIfNull(id);
        return _repo.Find(id);
    }

    // Return may be null
    [return: MaybeNull]
    public T Find<T>(int id) where T : class
    {
        return _context.Set<T>().Find(id);
    }

    // Output parameter set if returns true
    public bool TryGet(int id, [NotNullWhen(true)] out User? user)
    {
        user = _repo.Find(id);
        return user is not null;
    }
}

// Null-coalescing patterns
string name = user?.Name ?? "Anonymous";
int length = text?.Length ?? 0;

// Null-conditional with assignment
user?.Settings?.Theme = "dark"; // No-op if null
```

## Span and Memory Patterns

```csharp
// Zero-allocation string processing
public static int CountWords(ReadOnlySpan<char> text)
{
    if (text.IsEmpty) return 0;

    int count = 0;
    bool inWord = false;

    foreach (char c in text)
    {
        if (char.IsWhiteSpace(c))
        {
            inWord = false;
        }
        else if (!inWord)
        {
            inWord = true;
            count++;
        }
    }
    return count;
}

// Stackalloc for small buffers
public static string FormatId(int id)
{
    Span<char> buffer = stackalloc char[16];
    id.TryFormat(buffer, out int written);
    return new string(buffer[..written]);
}

// Memory<T> for async scenarios
public async Task ProcessAsync(Memory<byte> buffer)
{
    await _stream.ReadAsync(buffer);
    // Process buffer...
}
```

## Generics with Constraints

```csharp
// Multiple constraints
public class Repository<T> where T : class, IEntity, new()
{
    public T Create() => new T();
}

// Covariance (out) - can return derived types
public interface IReadOnlyRepository<out T>
{
    T? GetById(int id);
    IEnumerable<T> GetAll();
}

// Contravariance (in) - can accept base types
public interface IComparer<in T>
{
    int Compare(T x, T y);
}

// Static abstract members (C# 11+)
public interface IParsable<TSelf> where TSelf : IParsable<TSelf>
{
    static abstract TSelf Parse(string s);
    static abstract bool TryParse(string? s, out TSelf result);
}
```

## C# 12+ Features

```csharp
// Collection expressions
int[] numbers = [1, 2, 3, 4, 5];
List<string> names = ["Alice", "Bob"];
Span<int> span = [1, 2, 3];

// Spread operator
int[] combined = [..numbers, 6, 7, ..otherNumbers];

// Primary constructors for classes
public class OrderService(IOrderRepository repo, ILogger<OrderService> logger)
{
    public async Task<Order?> GetAsync(int id)
    {
        logger.LogDebug("Fetching order {OrderId}", id);
        return await repo.GetByIdAsync(id);
    }
}

// Alias any type
using Point = (int X, int Y);
using UserId = System.Int32;

// Default lambda parameters
var greet = (string name = "World") => $"Hello, {name}!";

// Inline arrays (for high-performance scenarios)
[InlineArray(16)]
public struct Buffer16<T>
{
    private T _element0;
}
```

## Async Patterns

```csharp
// ValueTask for hot paths
public ValueTask<int> GetCachedCountAsync()
{
    if (_cache.TryGetValue("count", out int count))
        return ValueTask.FromResult(count);

    return new ValueTask<int>(LoadCountAsync());
}

// IAsyncEnumerable for streaming
public async IAsyncEnumerable<User> GetUsersAsync(
    [EnumeratorCancellation] CancellationToken ct = default)
{
    await foreach (var user in _db.Users.AsAsyncEnumerable().WithCancellation(ct))
    {
        yield return user;
    }
}

// Parallel async with SemaphoreSlim
public async Task ProcessAllAsync(IEnumerable<int> ids, int maxConcurrency = 10)
{
    using var semaphore = new SemaphoreSlim(maxConcurrency);
    var tasks = ids.Select(async id =>
    {
        await semaphore.WaitAsync();
        try { await ProcessAsync(id); }
        finally { semaphore.Release(); }
    });
    await Task.WhenAll(tasks);
}
```
