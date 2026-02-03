---
name: Razor Pages
description: ASP.NET Core Razor Pages patterns for server-rendered web apps.
metadata:
  labels: [razor, mvc, aspnet, web]
  triggers:
    files: ['**/*.cshtml', '**/*.cshtml.cs']
    keywords: [PageModel, OnGet, OnPost, asp-for, asp-action]
---

# Razor Pages

## **Priority: P1 (OPERATIONAL)**

ASP.NET Core Razor Pages patterns for server-rendered web applications.

## Implementation Guidelines

- **PageModel**: Keep logic in PageModel, not in `.cshtml`. Use handlers (`OnGet`, `OnPost`).
- **Model Binding**: Use `[BindProperty]` for form data. `[FromQuery]` for query params.
- **Tag Helpers**: Use `asp-for`, `asp-action`, `asp-route-*` for type-safe HTML.
- **Partial Views**: Reusable UI components with `<partial>` tag helper.
- **View Components**: Complex reusable UI with server logic.
- **Layout**: Shared layout in `_Layout.cshtml`. Use sections for page-specific content.
- **TempData**: Flash messages with PRG (Post-Redirect-Get) pattern.

## Anti-Patterns

- **No logic in `.cshtml`**: Move to PageModel or View Components.
- **No `ViewBag`/`ViewData`**: Use strongly-typed models.
- **No inline CSS/JS**: Use external files with bundling.
- **No form without anti-forgery**: Always include `@Html.AntiForgeryToken()` or use `asp-antiforgery`.

## Code

```csharp
// Pages/Users/Create.cshtml.cs
public class CreateModel(IUserService userService, ILogger<CreateModel> logger) : PageModel
{
    [BindProperty]
    public CreateUserInput Input { get; set; } = new();

    public List<SelectListItem> Roles { get; set; } = [];

    public async Task OnGetAsync()
    {
        Roles = await GetRolesAsync();
    }

    public async Task<IActionResult> OnPostAsync()
    {
        if (!ModelState.IsValid)
        {
            Roles = await GetRolesAsync();
            return Page();
        }

        var result = await userService.CreateAsync(Input);

        if (!result.IsSuccess)
        {
            ModelState.AddModelError(string.Empty, result.Error!);
            Roles = await GetRolesAsync();
            return Page();
        }

        TempData["Success"] = "User created successfully";
        return RedirectToPage("./Index");
    }
}
```

```html
@* Pages/Users/Create.cshtml *@
@page
@model CreateModel

<h2>Create User</h2>

@if (TempData["Error"] is string error)
{
    <div class="alert alert-danger">@error</div>
}

<form method="post">
    <div asp-validation-summary="ModelOnly" class="text-danger"></div>

    <div class="mb-3">
        <label asp-for="Input.Name" class="form-label"></label>
        <input asp-for="Input.Name" class="form-control" />
        <span asp-validation-for="Input.Name" class="text-danger"></span>
    </div>

    <div class="mb-3">
        <label asp-for="Input.Email" class="form-label"></label>
        <input asp-for="Input.Email" class="form-control" type="email" />
        <span asp-validation-for="Input.Email" class="text-danger"></span>
    </div>

    <div class="mb-3">
        <label asp-for="Input.RoleId" class="form-label"></label>
        <select asp-for="Input.RoleId" asp-items="Model.Roles" class="form-select">
            <option value="">Select a role</option>
        </select>
        <span asp-validation-for="Input.RoleId" class="text-danger"></span>
    </div>

    <button type="submit" class="btn btn-primary">Create</button>
    <a asp-page="./Index" class="btn btn-secondary">Cancel</a>
</form>

@section Scripts {
    <partial name="_ValidationScriptsPartial" />
}
```

## Reference & Examples

For page conventions, view components, and AJAX patterns:
See [references/REFERENCE.md](references/REFERENCE.md).

## Related Topics

aspnet-core | blazor | security
