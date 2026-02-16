---
name: ASP.NET Core Web API
description: Modern ASP.NET Core patterns for building RESTful APIs.
metadata:
  labels: [aspnet, webapi, rest, minimal-api]
  triggers:
    files: ['**/*.cs', 'Program.cs']
    keywords: [WebApplication, MapGet, MapPost, Controller, ApiController]
---

# ASP.NET Core Web API

## **Priority: P1 (OPERATIONAL)**

Modern ASP.NET Core patterns for building RESTful APIs.

## Implementation Guidelines

- **Minimal APIs**: Use for simple endpoints. `app.MapGet()`, route groups, endpoint filters.
- **Controllers**: Use `[ApiController]` for automatic model validation and binding.
- **Middleware**: Order matters. Custom middleware with `app.Use()`.
- **Filters**: Action filters for cross-cutting concerns. Exception filters for error handling.
- **Validation**: FluentValidation or DataAnnotations. Return `ProblemDetails` on errors.
- **Versioning**: URL-based (`/api/v1/`) or header-based versioning.
- **OpenAPI**: Always configure Swagger for API documentation.
- **Response Types**: Use `TypedResults` for compile-time safety.

## Anti-Patterns

- **No `HttpClient` without `IHttpClientFactory`**: Socket exhaustion risk.
- **No blocking async**: Never `.Result` or `.Wait()` in controllers.
- **No business logic in controllers**: Controllers should only orchestrate.
- **No returning `Task` without `async`**: Use `async` keyword or return directly.

## Code

```csharp
// Minimal API with route groups
var app = WebApplication.CreateBuilder(args).Build();

var users = app.MapGroup("/api/users")
    .WithTags("Users")
    .RequireAuthorization();

users.MapGet("/", async (IUserService service) =>
    TypedResults.Ok(await service.GetAllAsync()));

users.MapGet("/{id:int}", async (int id, IUserService service) =>
    await service.GetByIdAsync(id) is { } user
        ? TypedResults.Ok(user)
        : TypedResults.NotFound());

users.MapPost("/", async (CreateUserDto dto, IUserService service) =>
{
    var user = await service.CreateAsync(dto);
    return TypedResults.Created($"/api/users/{user.Id}", user);
}).AddEndpointFilter<ValidationFilter<CreateUserDto>>();

// Controller with proper patterns
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class OrdersController(IOrderService orderService) : ControllerBase
{
    [HttpGet("{id:int}")]
    [ProducesResponseType<OrderDto>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetOrder(int id, CancellationToken ct)
    {
        var order = await orderService.GetByIdAsync(id, ct);
        return order is null ? NotFound() : Ok(order);
    }

    [HttpPost]
    [ProducesResponseType<OrderDto>(StatusCodes.Status201Created)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateOrder(CreateOrderDto dto, CancellationToken ct)
    {
        var order = await orderService.CreateAsync(dto, ct);
        return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
    }
}
```

## Reference & Examples

For middleware, exception handling, and HttpClientFactory:
See [references/REFERENCE.md](references/REFERENCE.md).

## Related Topics

security | razor-pages | blazor
