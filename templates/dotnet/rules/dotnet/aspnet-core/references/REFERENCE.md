# ASP.NET Core Web API Reference

Middleware, exception handling, and advanced patterns.

## References

- [**Middleware**](middleware.md) - Custom middleware patterns.
- [**Exception Handling**](exception-handling.md) - Global error handling.
- [**HttpClientFactory**](httpclient-factory.md) - Typed HTTP clients.

## Global Exception Handling Middleware

```csharp
public class ExceptionMiddleware(
    RequestDelegate next,
    ILogger<ExceptionMiddleware> logger,
    IHostEnvironment env)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled exception: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/problem+json";

        var (statusCode, title) = exception switch
        {
            NotFoundException => (StatusCodes.Status404NotFound, "Not Found"),
            ValidationException => (StatusCodes.Status400BadRequest, "Validation Error"),
            UnauthorizedAccessException => (StatusCodes.Status401Unauthorized, "Unauthorized"),
            ForbiddenException => (StatusCodes.Status403Forbidden, "Forbidden"),
            _ => (StatusCodes.Status500InternalServerError, "Internal Server Error")
        };

        context.Response.StatusCode = statusCode;

        var problem = new ProblemDetails
        {
            Status = statusCode,
            Title = title,
            Detail = env.IsDevelopment() ? exception.Message : null,
            Instance = context.Request.Path
        };

        if (exception is ValidationException validationEx)
        {
            problem.Extensions["errors"] = validationEx.Errors;
        }

        await context.Response.WriteAsJsonAsync(problem);
    }
}

// Registration
app.UseMiddleware<ExceptionMiddleware>();
```

## Minimal API Endpoint Filters

```csharp
// Validation filter
public class ValidationFilter<T> : IEndpointFilter where T : class
{
    public async ValueTask<object?> InvokeAsync(
        EndpointFilterInvocationContext context,
        EndpointFilterDelegate next)
    {
        var model = context.Arguments.OfType<T>().FirstOrDefault();

        if (model is null)
            return TypedResults.BadRequest("Request body is required");

        var validator = context.HttpContext.RequestServices.GetService<IValidator<T>>();

        if (validator is not null)
        {
            var result = await validator.ValidateAsync(model);
            if (!result.IsValid)
            {
                return TypedResults.ValidationProblem(
                    result.ToDictionary());
            }
        }

        return await next(context);
    }
}

// Logging filter
public class LoggingFilter(ILogger<LoggingFilter> logger) : IEndpointFilter
{
    public async ValueTask<object?> InvokeAsync(
        EndpointFilterInvocationContext context,
        EndpointFilterDelegate next)
    {
        var path = context.HttpContext.Request.Path;
        logger.LogInformation("Request started: {Path}", path);

        var sw = Stopwatch.StartNew();
        var result = await next(context);
        sw.Stop();

        logger.LogInformation("Request completed: {Path} in {ElapsedMs}ms",
            path, sw.ElapsedMilliseconds);

        return result;
    }
}

// Usage
app.MapPost("/api/users", handler)
   .AddEndpointFilter<ValidationFilter<CreateUserDto>>()
   .AddEndpointFilter<LoggingFilter>();
```

## IHttpClientFactory Typed Clients

```csharp
// Typed client
public class PaymentClient(HttpClient httpClient)
{
    public async Task<PaymentResult?> ProcessPaymentAsync(PaymentRequest request)
    {
        var response = await httpClient.PostAsJsonAsync("/payments", request);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<PaymentResult>();
    }

    public async Task<PaymentStatus?> GetStatusAsync(string paymentId)
    {
        return await httpClient.GetFromJsonAsync<PaymentStatus>($"/payments/{paymentId}");
    }
}

// Registration with resilience
builder.Services.AddHttpClient<PaymentClient>(client =>
{
    client.BaseAddress = new Uri(builder.Configuration["Payment:BaseUrl"]!);
    client.DefaultRequestHeaders.Add("X-Api-Key",
        builder.Configuration["Payment:ApiKey"]);
    client.Timeout = TimeSpan.FromSeconds(30);
})
.AddStandardResilienceHandler(); // Polly retry, circuit breaker

// Manual resilience configuration
builder.Services.AddHttpClient<PaymentClient>()
    .AddResilienceHandler("payment-pipeline", builder =>
    {
        builder
            .AddRetry(new HttpRetryStrategyOptions
            {
                MaxRetryAttempts = 3,
                Delay = TimeSpan.FromSeconds(1),
                BackoffType = DelayBackoffType.Exponential
            })
            .AddCircuitBreaker(new HttpCircuitBreakerStrategyOptions
            {
                SamplingDuration = TimeSpan.FromSeconds(30),
                FailureRatio = 0.5,
                MinimumThroughput = 10,
                BreakDuration = TimeSpan.FromSeconds(30)
            })
            .AddTimeout(TimeSpan.FromSeconds(10));
    });
```

## Background Services

```csharp
public class OrderProcessingService(
    IServiceScopeFactory scopeFactory,
    ILogger<OrderProcessingService> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        logger.LogInformation("Order processing service started");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await ProcessPendingOrdersAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error processing orders");
            }

            await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
        }
    }

    private async Task ProcessPendingOrdersAsync(CancellationToken ct)
    {
        using var scope = scopeFactory.CreateScope();
        var orderService = scope.ServiceProvider.GetRequiredService<IOrderService>();

        var pendingOrders = await orderService.GetPendingOrdersAsync(ct);

        foreach (var order in pendingOrders)
        {
            await orderService.ProcessAsync(order.Id, ct);
            logger.LogInformation("Processed order {OrderId}", order.Id);
        }
    }
}

// Registration
builder.Services.AddHostedService<OrderProcessingService>();
```

## Health Checks

```csharp
// Registration
builder.Services.AddHealthChecks()
    .AddDbContextCheck<AppDbContext>("database")
    .AddRedis(builder.Configuration.GetConnectionString("Redis")!, "redis")
    .AddUrlGroup(new Uri("https://api.external.com/health"), "external-api")
    .AddCheck<CustomHealthCheck>("custom");

// Custom health check
public class CustomHealthCheck(IOrderService orderService) : IHealthCheck
{
    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken ct = default)
    {
        try
        {
            var count = await orderService.GetPendingCountAsync(ct);

            if (count > 1000)
            {
                return HealthCheckResult.Degraded(
                    $"High pending orders: {count}");
            }

            return HealthCheckResult.Healthy();
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy("Order service unavailable", ex);
        }
    }
}

// Endpoints
app.MapHealthChecks("/health", new HealthCheckOptions
{
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
});

app.MapHealthChecks("/health/ready", new HealthCheckOptions
{
    Predicate = check => check.Tags.Contains("ready")
});

app.MapHealthChecks("/health/live", new HealthCheckOptions
{
    Predicate = _ => false // Just checks if app is running
});
```

## Model Binding and Validation

```csharp
// FluentValidation
public class CreateOrderDtoValidator : AbstractValidator<CreateOrderDto>
{
    public CreateOrderDtoValidator()
    {
        RuleFor(x => x.CustomerId)
            .NotEmpty()
            .WithMessage("Customer ID is required");

        RuleFor(x => x.Items)
            .NotEmpty()
            .WithMessage("Order must have at least one item");

        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(x => x.ProductId).NotEmpty();
            item.RuleFor(x => x.Quantity).GreaterThan(0);
        });

        RuleFor(x => x.ShippingAddress)
            .NotNull()
            .SetValidator(new AddressValidator());
    }
}

// Registration
builder.Services.AddValidatorsFromAssemblyContaining<CreateOrderDtoValidator>();

// Pipeline behavior for MediatR
public class ValidationBehavior<TRequest, TResponse>(
    IEnumerable<IValidator<TRequest>> validators)
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken ct)
    {
        if (!validators.Any())
            return await next();

        var context = new ValidationContext<TRequest>(request);
        var results = await Task.WhenAll(
            validators.Select(v => v.ValidateAsync(context, ct)));

        var failures = results
            .SelectMany(r => r.Errors)
            .Where(f => f != null)
            .ToList();

        if (failures.Count != 0)
            throw new ValidationException(failures);

        return await next();
    }
}
```
