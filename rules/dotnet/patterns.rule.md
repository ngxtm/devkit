---
id: dotnet-patterns
version: 1.0.0
triggers:
  files: ['**/*.cs']
  keywords: [Result, Repository, CQRS, MediatR, Handler, Command, Query]
---

# .NET Design Patterns

Common architectural and design patterns for .NET applications.

## Result Pattern

Explicit success/failure handling without exceptions for expected failures.

```csharp
public readonly struct Result<T>
{
    public bool IsSuccess { get; }
    public T? Value { get; }
    public string? Error { get; }

    private Result(T value) => (IsSuccess, Value) = (true, value);
    private Result(string error) => (IsSuccess, Error) = (false, error);

    public static Result<T> Success(T value) => new(value);
    public static Result<T> Failure(string error) => new(error);

    public TResult Match<TResult>(
        Func<T, TResult> onSuccess,
        Func<string, TResult> onFailure) =>
        IsSuccess ? onSuccess(Value!) : onFailure(Error!);
}

// Usage
public async Task<Result<User>> GetUserAsync(int id)
{
    var user = await _repo.FindAsync(id);
    return user is null
        ? Result<User>.Failure("User not found")
        : Result<User>.Success(user);
}

// In controller
var result = await _service.GetUserAsync(id);
return result.Match<IActionResult>(
    user => Ok(user),
    error => NotFound(new { error }));
```

## Repository Pattern

Abstract data access with a generic interface.

```csharp
public interface IRepository<T> where T : class, IEntity
{
    Task<T?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IReadOnlyList<T>> GetAllAsync(CancellationToken ct = default);
    Task<T> AddAsync(T entity, CancellationToken ct = default);
    Task UpdateAsync(T entity, CancellationToken ct = default);
    Task DeleteAsync(T entity, CancellationToken ct = default);
}

public class Repository<T>(AppDbContext context) : IRepository<T>
    where T : class, IEntity
{
    protected readonly DbSet<T> DbSet = context.Set<T>();

    public virtual async Task<T?> GetByIdAsync(int id, CancellationToken ct = default) =>
        await DbSet.FindAsync([id], ct);

    public virtual async Task<IReadOnlyList<T>> GetAllAsync(CancellationToken ct = default) =>
        await DbSet.ToListAsync(ct);

    public virtual async Task<T> AddAsync(T entity, CancellationToken ct = default)
    {
        await DbSet.AddAsync(entity, ct);
        await context.SaveChangesAsync(ct);
        return entity;
    }

    public virtual async Task UpdateAsync(T entity, CancellationToken ct = default)
    {
        DbSet.Update(entity);
        await context.SaveChangesAsync(ct);
    }

    public virtual async Task DeleteAsync(T entity, CancellationToken ct = default)
    {
        DbSet.Remove(entity);
        await context.SaveChangesAsync(ct);
    }
}
```

## CQRS with MediatR

Separate read (Query) and write (Command) operations.

```csharp
// Command
public record CreateOrderCommand(int UserId, List<OrderItemDto> Items)
    : IRequest<Result<int>>;

public class CreateOrderHandler(
    IOrderRepository repo,
    IUnitOfWork uow,
    ILogger<CreateOrderHandler> logger)
    : IRequestHandler<CreateOrderCommand, Result<int>>
{
    public async Task<Result<int>> Handle(
        CreateOrderCommand request,
        CancellationToken ct)
    {
        var order = Order.Create(request.UserId, request.Items);

        if (order.IsFailure)
            return Result<int>.Failure(order.Error!);

        await repo.AddAsync(order.Value!, ct);
        await uow.SaveChangesAsync(ct);

        logger.LogInformation("Order {OrderId} created", order.Value!.Id);

        return Result<int>.Success(order.Value!.Id);
    }
}

// Query
public record GetOrderQuery(int OrderId) : IRequest<OrderDto?>;

public class GetOrderHandler(IOrderRepository repo)
    : IRequestHandler<GetOrderQuery, OrderDto?>
{
    public async Task<OrderDto?> Handle(GetOrderQuery request, CancellationToken ct) =>
        await repo.GetDtoByIdAsync(request.OrderId, ct);
}

// Controller usage
[ApiController]
[Route("api/orders")]
public class OrdersController(ISender mediator) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create(CreateOrderRequest request)
    {
        var command = new CreateOrderCommand(request.UserId, request.Items);
        var result = await mediator.Send(command);

        return result.Match<IActionResult>(
            id => CreatedAtAction(nameof(Get), new { id }, null),
            error => BadRequest(new { error }));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(int id)
    {
        var order = await mediator.Send(new GetOrderQuery(id));
        return order is null ? NotFound() : Ok(order);
    }
}
```

## Options Pattern

Strongly-typed configuration with validation.

```csharp
public class EmailSettings
{
    public const string SectionName = "Email";

    [Required]
    public string SmtpHost { get; init; } = string.Empty;

    [Range(1, 65535)]
    public int SmtpPort { get; init; } = 587;

    [Required, EmailAddress]
    public string FromAddress { get; init; } = string.Empty;

    public bool UseSsl { get; init; } = true;
}

// Registration with validation
builder.Services.AddOptions<EmailSettings>()
    .BindConfiguration(EmailSettings.SectionName)
    .ValidateDataAnnotations()
    .ValidateOnStart();

// Usage
public class EmailService(IOptions<EmailSettings> options)
{
    private readonly EmailSettings _settings = options.Value;

    public async Task SendAsync(string to, string subject, string body)
    {
        using var client = new SmtpClient(_settings.SmtpHost, _settings.SmtpPort);
        client.EnableSsl = _settings.UseSsl;
        // Send email...
    }
}
```

## Specification Pattern

Encapsulate query logic for reuse and composition.

```csharp
public abstract class Specification<T>
{
    public abstract Expression<Func<T, bool>> ToExpression();

    public bool IsSatisfiedBy(T entity) =>
        ToExpression().Compile()(entity);

    public Specification<T> And(Specification<T> other) =>
        new AndSpecification<T>(this, other);

    public Specification<T> Or(Specification<T> other) =>
        new OrSpecification<T>(this, other);

    public Specification<T> Not() =>
        new NotSpecification<T>(this);
}

public class AndSpecification<T>(Specification<T> left, Specification<T> right)
    : Specification<T>
{
    public override Expression<Func<T, bool>> ToExpression()
    {
        var leftExpr = left.ToExpression();
        var rightExpr = right.ToExpression();

        var param = Expression.Parameter(typeof(T));
        var body = Expression.AndAlso(
            Expression.Invoke(leftExpr, param),
            Expression.Invoke(rightExpr, param));

        return Expression.Lambda<Func<T, bool>>(body, param);
    }
}

// Concrete specifications
public class ActiveUserSpec : Specification<User>
{
    public override Expression<Func<User, bool>> ToExpression() =>
        user => user.IsActive && !user.IsDeleted;
}

public class UserInRoleSpec(string role) : Specification<User>
{
    public override Expression<Func<User, bool>> ToExpression() =>
        user => user.Role == role;
}

// Usage
var spec = new ActiveUserSpec().And(new UserInRoleSpec("Admin"));
var admins = await _context.Users.Where(spec.ToExpression()).ToListAsync();
```

## Unit of Work

Coordinate multiple repositories in a transaction.

```csharp
public interface IUnitOfWork : IAsyncDisposable
{
    IUserRepository Users { get; }
    IOrderRepository Orders { get; }
    IProductRepository Products { get; }

    Task<int> SaveChangesAsync(CancellationToken ct = default);
    Task BeginTransactionAsync(CancellationToken ct = default);
    Task CommitAsync(CancellationToken ct = default);
    Task RollbackAsync(CancellationToken ct = default);
}

public class UnitOfWork(AppDbContext context) : IUnitOfWork
{
    private IDbContextTransaction? _transaction;
    private IUserRepository? _users;
    private IOrderRepository? _orders;
    private IProductRepository? _products;

    public IUserRepository Users => _users ??= new UserRepository(context);
    public IOrderRepository Orders => _orders ??= new OrderRepository(context);
    public IProductRepository Products => _products ??= new ProductRepository(context);

    public Task<int> SaveChangesAsync(CancellationToken ct = default) =>
        context.SaveChangesAsync(ct);

    public async Task BeginTransactionAsync(CancellationToken ct = default) =>
        _transaction = await context.Database.BeginTransactionAsync(ct);

    public async Task CommitAsync(CancellationToken ct = default)
    {
        await context.SaveChangesAsync(ct);
        if (_transaction is not null)
            await _transaction.CommitAsync(ct);
    }

    public async Task RollbackAsync(CancellationToken ct = default)
    {
        if (_transaction is not null)
            await _transaction.RollbackAsync(ct);
    }

    public async ValueTask DisposeAsync()
    {
        if (_transaction is not null)
            await _transaction.DisposeAsync();
        await context.DisposeAsync();
    }
}

// Usage
public class OrderService(IUnitOfWork uow)
{
    public async Task<Result<int>> CreateOrderWithInventoryUpdate(
        CreateOrderCommand command, CancellationToken ct)
    {
        await uow.BeginTransactionAsync(ct);

        try
        {
            var order = new Order(command.UserId);

            foreach (var item in command.Items)
            {
                var product = await uow.Products.GetByIdAsync(item.ProductId, ct);
                if (product is null || product.Stock < item.Quantity)
                {
                    await uow.RollbackAsync(ct);
                    return Result<int>.Failure("Insufficient stock");
                }

                product.Stock -= item.Quantity;
                order.AddItem(product, item.Quantity);
            }

            await uow.Orders.AddAsync(order, ct);
            await uow.CommitAsync(ct);

            return Result<int>.Success(order.Id);
        }
        catch
        {
            await uow.RollbackAsync(ct);
            throw;
        }
    }
}
```

## Factory Pattern

Encapsulate object creation logic.

```csharp
public interface INotificationFactory
{
    INotification Create(NotificationType type);
}

public class NotificationFactory(IServiceProvider services) : INotificationFactory
{
    public INotification Create(NotificationType type) => type switch
    {
        NotificationType.Email => services.GetRequiredService<EmailNotification>(),
        NotificationType.Sms => services.GetRequiredService<SmsNotification>(),
        NotificationType.Push => services.GetRequiredService<PushNotification>(),
        _ => throw new ArgumentException($"Unknown notification type: {type}")
    };
}

// Registration
builder.Services.AddTransient<EmailNotification>();
builder.Services.AddTransient<SmsNotification>();
builder.Services.AddTransient<PushNotification>();
builder.Services.AddSingleton<INotificationFactory, NotificationFactory>();
```

## Related Topics

See also: [language](language/SKILL.md) | [best-practices](best-practices/SKILL.md) | [aspnet-core](aspnet-core/SKILL.md)
