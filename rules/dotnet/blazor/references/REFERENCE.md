# Blazor Reference

Component lifecycle, state management, and advanced patterns.

## References

- [**Lifecycle**](lifecycle.md) - Component lifecycle methods.
- [**State Management**](state-management.md) - Fluxor, cascading values.
- [**JS Interop**](js-interop.md) - JavaScript interoperability.

## Component Lifecycle

```csharp
@code {
    // 1. Called when component is first initialized (before rendering)
    protected override void OnInitialized()
    {
        // Sync initialization
    }

    // 1b. Async version (preferred for data loading)
    protected override async Task OnInitializedAsync()
    {
        // Load initial data
        _data = await DataService.GetAsync();
    }

    // 2. Called when parameters are set/changed
    protected override void OnParametersSet()
    {
        // React to parameter changes
    }

    protected override async Task OnParametersSetAsync()
    {
        // Async parameter processing
    }

    // 3. Called after component has rendered
    protected override void OnAfterRender(bool firstRender)
    {
        if (firstRender)
        {
            // First render only - initialize JS libraries
        }
        // Every render - update DOM-dependent state
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            await JSRuntime.InvokeVoidAsync("initializeChart", _chartElement);
        }
    }

    // 4. Optimize re-rendering
    protected override bool ShouldRender()
    {
        // Return false to prevent re-rendering
        return _hasChanged;
    }

    // 5. Cleanup when component is disposed
    public void Dispose()
    {
        // Unsubscribe from events, dispose resources
        _subscription?.Dispose();
    }

    // Async dispose (IAsyncDisposable)
    public async ValueTask DisposeAsync()
    {
        await JSRuntime.InvokeVoidAsync("cleanup");
    }
}
```

## State Management Patterns

```csharp
// 1. Cascading Values - App-wide state
// App.razor or Routes.razor
<CascadingValue Value="@_themeState">
    <CascadingValue Value="@_userState">
        <Router AppAssembly="@typeof(App).Assembly">
            ...
        </Router>
    </CascadingValue>
</CascadingValue>

@code {
    private ThemeState _themeState = new();
    private UserState _userState = new();
}

// Consuming component
@code {
    [CascadingParameter]
    public ThemeState Theme { get; set; } = default!;

    [CascadingParameter]
    public UserState User { get; set; } = default!;
}
```

```csharp
// 2. State Container Service
public class CartState
{
    private readonly List<CartItem> _items = [];

    public IReadOnlyList<CartItem> Items => _items.AsReadOnly();
    public decimal Total => _items.Sum(i => i.Price * i.Quantity);

    public event Action? OnChange;

    public void AddItem(CartItem item)
    {
        _items.Add(item);
        NotifyStateChanged();
    }

    public void RemoveItem(int productId)
    {
        _items.RemoveAll(i => i.ProductId == productId);
        NotifyStateChanged();
    }

    private void NotifyStateChanged() => OnChange?.Invoke();
}

// Registration
builder.Services.AddScoped<CartState>();

// Component usage
@inject CartState Cart
@implements IDisposable

<div>Total: @Cart.Total.ToString("C")</div>

@code {
    protected override void OnInitialized()
    {
        Cart.OnChange += StateHasChanged;
    }

    public void Dispose()
    {
        Cart.OnChange -= StateHasChanged;
    }
}
```

```csharp
// 3. Fluxor (Redux pattern)
// State
public record CounterState(int Count);

public class CounterFeature : Feature<CounterState>
{
    public override string GetName() => "Counter";
    protected override CounterState GetInitialState() => new(0);
}

// Actions
public record IncrementAction();
public record DecrementAction();
public record SetCountAction(int Count);

// Reducers
public static class CounterReducers
{
    [ReducerMethod]
    public static CounterState OnIncrement(CounterState state, IncrementAction _)
        => state with { Count = state.Count + 1 };

    [ReducerMethod]
    public static CounterState OnDecrement(CounterState state, DecrementAction _)
        => state with { Count = state.Count - 1 };

    [ReducerMethod]
    public static CounterState OnSetCount(CounterState state, SetCountAction action)
        => state with { Count = action.Count };
}

// Component
@inject IState<CounterState> CounterState
@inject IDispatcher Dispatcher

<p>Count: @CounterState.Value.Count</p>
<button @onclick="Increment">+</button>
<button @onclick="Decrement">-</button>

@code {
    private void Increment() => Dispatcher.Dispatch(new IncrementAction());
    private void Decrement() => Dispatcher.Dispatch(new DecrementAction());
}
```

## JS Interop

```csharp
// Calling JavaScript from C#
@inject IJSRuntime JS

@code {
    private ElementReference _inputElement;

    // Call JS function
    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            await JS.InvokeVoidAsync("initializeComponent", _inputElement);
        }
    }

    // Call JS function with return value
    private async Task<string> GetLocalStorage(string key)
    {
        return await JS.InvokeAsync<string>("localStorage.getItem", key);
    }

    // Focus element
    private async Task FocusInput()
    {
        await _inputElement.FocusAsync();
    }
}
```

```javascript
// wwwroot/js/interop.js
window.initializeComponent = (element) => {
    // Initialize third-party library
    new SomeLibrary(element);
};

window.blazorInterop = {
    showAlert: (message) => alert(message),
    getWindowSize: () => ({ width: window.innerWidth, height: window.innerHeight })
};
```

```csharp
// Calling C# from JavaScript
// In component
@inject IJSRuntime JS

@code {
    private DotNetObjectReference<MyComponent>? _objRef;

    protected override void OnInitialized()
    {
        _objRef = DotNetObjectReference.Create(this);
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            await JS.InvokeVoidAsync("registerCallback", _objRef);
        }
    }

    [JSInvokable]
    public void HandleCallback(string data)
    {
        // Called from JavaScript
        Console.WriteLine($"Received: {data}");
        StateHasChanged();
    }

    public void Dispose()
    {
        _objRef?.Dispose();
    }
}
```

```javascript
// JavaScript calling C#
window.registerCallback = (dotNetRef) => {
    window.myCallback = (data) => {
        dotNetRef.invokeMethodAsync('HandleCallback', data);
    };
};

// Later...
myCallback('Some data from JS');
```

## Render Modes (.NET 8+)

```razor
@* Static Server Rendering (SSR) - Default *@
@rendermode InteractiveServer
@rendermode InteractiveWebAssembly
@rendermode InteractiveAuto

@* Per-component render mode *@
<Counter @rendermode="InteractiveServer" />
<Counter @rendermode="InteractiveWebAssembly" />

@* Streaming rendering for slow data *@
@attribute [StreamRendering]

<h1>Dashboard</h1>

@if (_data is null)
{
    <p>Loading dashboard data...</p>
}
else
{
    <DashboardContent Data="_data" />
}

@code {
    private DashboardData? _data;

    protected override async Task OnInitializedAsync()
    {
        // This data streams to the client as it loads
        _data = await SlowDataService.GetDashboardAsync();
    }
}
```

## Error Handling

```razor
@* ErrorBoundary for graceful error handling *@
<ErrorBoundary @ref="_errorBoundary">
    <ChildContent>
        <RiskyComponent />
    </ChildContent>
    <ErrorContent Context="exception">
        <div class="alert alert-danger">
            <h4>Something went wrong</h4>
            <p>@exception.Message</p>
            <button @onclick="Recover">Try Again</button>
        </div>
    </ErrorContent>
</ErrorBoundary>

@code {
    private ErrorBoundary? _errorBoundary;

    private void Recover()
    {
        _errorBoundary?.Recover();
    }
}
```

## Authentication in Blazor

```razor
@* Show content based on auth state *@
<AuthorizeView>
    <Authorized>
        <p>Hello, @context.User.Identity?.Name!</p>
        <a href="account/logout">Logout</a>
    </Authorized>
    <NotAuthorized>
        <a href="account/login">Login</a>
    </NotAuthorized>
</AuthorizeView>

@* Role-based content *@
<AuthorizeView Roles="Admin,Manager">
    <Authorized>
        <AdminPanel />
    </Authorized>
    <NotAuthorized>
        <p>Access denied</p>
    </NotAuthorized>
</AuthorizeView>

@* Policy-based content *@
<AuthorizeView Policy="CanEditOrders">
    <button @onclick="EditOrder">Edit</button>
</AuthorizeView>

@* Protect entire page *@
@page "/admin"
@attribute [Authorize(Roles = "Admin")]

<h1>Admin Dashboard</h1>
```
