---
name: Blazor
description: Blazor component patterns for interactive web UIs.
metadata:
  labels: [blazor, components, wasm, server]
  triggers:
    files: ['**/*.razor', '**/*.razor.cs']
    keywords: [Component, Parameter, CascadingParameter, EventCallback, StateHasChanged]
---

# Blazor

## **Priority: P1 (OPERATIONAL)**

Blazor component patterns for interactive web UIs.

## Implementation Guidelines

- **Components**: Keep components focused. Split large components into smaller ones.
- **Parameters**: Use `[Parameter]` for one-way, `EventCallback` for two-way binding.
- **Cascading Values**: Use for app-wide state (theme, user context).
- **State Management**: Component state for local, Fluxor/custom service for global.
- **Forms**: `EditForm` with `DataAnnotationsValidator` or FluentValidation.
- **JS Interop**: Use `IJSRuntime` sparingly. Prefer Blazor bindings.
- **Render Modes**: Choose based on requirements (Server, WASM, Auto in .NET 8+).
- **Streaming**: Use `[StreamRendering]` for long-loading components.

## Anti-Patterns

- **No direct DOM manipulation**: Use Blazor bindings and refs.
- **No `StateHasChanged()` in lifecycle**: Called automatically after lifecycle methods.
- **No heavy computation in render**: Move to `OnInitialized` or background task.
- **No sync JS interop in Server mode**: Causes UI blocking.

## Code

```razor
@* UserList.razor *@
@page "/users"
@attribute [StreamRendering]
@inject IUserService UserService

<PageTitle>Users</PageTitle>

<h3>Users</h3>

@if (_users is null)
{
    <p><em>Loading...</em></p>
}
else if (_users.Count == 0)
{
    <p>No users found.</p>
}
else
{
    <div class="user-grid">
        @foreach (var user in _users)
        {
            <UserCard User="user" OnDelete="HandleDelete" />
        }
    </div>
}

@code {
    private List<User>? _users;

    protected override async Task OnInitializedAsync()
    {
        _users = await UserService.GetAllAsync();
    }

    private async Task HandleDelete(int userId)
    {
        await UserService.DeleteAsync(userId);
        _users = await UserService.GetAllAsync();
    }
}
```

```razor
@* UserCard.razor - Reusable component *@
<div class="card">
    <h5>@User.Name</h5>
    <p>@User.Email</p>
    <button @onclick="() => OnDelete.InvokeAsync(User.Id)">Delete</button>
</div>

@code {
    [Parameter, EditorRequired]
    public User User { get; set; } = default!;

    [Parameter]
    public EventCallback<int> OnDelete { get; set; }
}
```

```razor
@* EditForm with validation *@
<EditForm Model="@_model" OnValidSubmit="HandleSubmit" FormName="CreateUser">
    <DataAnnotationsValidator />
    <ValidationSummary class="text-danger" />

    <div class="mb-3">
        <label class="form-label">Name</label>
        <InputText @bind-Value="_model.Name" class="form-control" />
        <ValidationMessage For="@(() => _model.Name)" />
    </div>

    <div class="mb-3">
        <label class="form-label">Email</label>
        <InputText @bind-Value="_model.Email" class="form-control" type="email" />
        <ValidationMessage For="@(() => _model.Email)" />
    </div>

    <button type="submit" class="btn btn-primary" disabled="@_isSubmitting">
        @if (_isSubmitting)
        {
            <span class="spinner-border spinner-border-sm"></span>
        }
        Submit
    </button>
</EditForm>

@code {
    private CreateUserModel _model = new();
    private bool _isSubmitting;

    private async Task HandleSubmit()
    {
        _isSubmitting = true;
        await UserService.CreateAsync(_model);
        _isSubmitting = false;
        NavigationManager.NavigateTo("/users");
    }
}
```

## Reference & Examples

For lifecycle, state management, and JS interop:
See [references/REFERENCE.md](references/REFERENCE.md).

## Related Topics

aspnet-core | razor-pages | security
