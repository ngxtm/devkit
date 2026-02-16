# Razor Pages Reference

Page conventions, view components, and form handling patterns.

## References

- [**Page Conventions**](page-conventions.md) - Routing and authorization.
- [**View Components**](view-components.md) - Reusable UI components.
- [**Forms**](forms.md) - Form handling and validation.

## Page Routing Conventions

```csharp
// Program.cs - Custom conventions
builder.Services.AddRazorPages(options =>
{
    // Authorization
    options.Conventions.AuthorizeFolder("/Admin");
    options.Conventions.AuthorizeAreaFolder("Identity", "/Account/Manage");
    options.Conventions.AllowAnonymousToPage("/Public/Index");

    // Custom routes
    options.Conventions.AddPageRoute("/Products/Details", "/p/{id}");

    // Page model conventions
    options.Conventions.AddFolderApplicationModelConvention("/Blog",
        model => model.Filters.Add(new BlogPageFilter()));
});
```

## View Components

```csharp
// ViewComponents/ShoppingCartViewComponent.cs
public class ShoppingCartViewComponent(ICartService cartService) : ViewComponent
{
    public async Task<IViewComponentResult> InvokeAsync()
    {
        var cart = await cartService.GetCurrentCartAsync(
            HttpContext.User.Identity?.Name);

        return View(new ShoppingCartViewModel
        {
            ItemCount = cart?.Items.Count ?? 0,
            Total = cart?.Total ?? 0
        });
    }
}
```

```html
@* Views/Shared/Components/ShoppingCart/Default.cshtml *@
@model ShoppingCartViewModel

<div class="cart-widget">
    <a asp-page="/Cart/Index">
        <span class="badge">@Model.ItemCount</span>
        Cart: @Model.Total.ToString("C")
    </a>
</div>

@* Usage in layout *@
<nav>
    @await Component.InvokeAsync("ShoppingCart")
</nav>

@* Or with tag helper *@
<vc:shopping-cart></vc:shopping-cart>
```

## Handler Methods

```csharp
public class ProductsModel : PageModel
{
    [BindProperty(SupportsGet = true)]
    public string? SearchTerm { get; set; }

    [BindProperty(SupportsGet = true)]
    public int PageNumber { get; set; } = 1;

    public List<ProductDto> Products { get; set; } = [];

    // GET /Products
    public async Task OnGetAsync()
    {
        Products = await _service.SearchAsync(SearchTerm, PageNumber);
    }

    // GET /Products?handler=Export
    public async Task<IActionResult> OnGetExportAsync()
    {
        var csv = await _service.ExportToCsvAsync(SearchTerm);
        return File(csv, "text/csv", "products.csv");
    }

    // POST /Products (add to cart)
    public async Task<IActionResult> OnPostAddToCartAsync(int productId)
    {
        await _cartService.AddItemAsync(productId);
        return RedirectToPage();
    }

    // POST /Products?handler=Delete
    public async Task<IActionResult> OnPostDeleteAsync(int id)
    {
        await _service.DeleteAsync(id);
        TempData["Success"] = "Product deleted";
        return RedirectToPage();
    }
}
```

```html
@* Multiple forms on same page *@
<form method="get">
    <input asp-for="SearchTerm" placeholder="Search..." />
    <button type="submit">Search</button>
</form>

<a asp-page-handler="Export" asp-route-searchTerm="@Model.SearchTerm">
    Export to CSV
</a>

@foreach (var product in Model.Products)
{
    <div class="product">
        <h3>@product.Name</h3>

        <form method="post" asp-page-handler="AddToCart">
            <input type="hidden" name="productId" value="@product.Id" />
            <button type="submit">Add to Cart</button>
        </form>

        <form method="post" asp-page-handler="Delete"
              onsubmit="return confirm('Are you sure?')">
            <input type="hidden" name="id" value="@product.Id" />
            <button type="submit" class="btn-danger">Delete</button>
        </form>
    </div>
}
```

## AJAX with Razor Pages

```csharp
// PageModel
public class ContactModel : PageModel
{
    [BindProperty]
    public ContactForm Form { get; set; } = new();

    public async Task<IActionResult> OnPostAsync()
    {
        if (!ModelState.IsValid)
        {
            // Return validation errors for AJAX
            return new JsonResult(new
            {
                success = false,
                errors = ModelState.ToDictionary(
                    kvp => kvp.Key,
                    kvp => kvp.Value?.Errors.Select(e => e.ErrorMessage))
            });
        }

        await _emailService.SendContactFormAsync(Form);

        return new JsonResult(new { success = true });
    }
}
```

```html
@* AJAX form submission *@
<form id="contactForm" method="post">
    @Html.AntiForgeryToken()

    <input asp-for="Form.Name" />
    <input asp-for="Form.Email" />
    <textarea asp-for="Form.Message"></textarea>

    <button type="submit">Send</button>
</form>

<div id="result"></div>

@section Scripts {
<script>
document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    const response = await fetch(form.action, {
        method: 'POST',
        body: formData
    });

    const result = await response.json();

    if (result.success) {
        document.getElementById('result').innerHTML =
            '<div class="alert alert-success">Message sent!</div>';
        form.reset();
    } else {
        // Display validation errors
        console.log(result.errors);
    }
});
</script>
}
```

## Partial Views with Model

```csharp
// Partial with strongly-typed model
// Pages/Shared/_ProductCard.cshtml
@model ProductDto

<div class="card">
    <img src="@Model.ImageUrl" alt="@Model.Name" />
    <h5>@Model.Name</h5>
    <p>@Model.Price.ToString("C")</p>
    <a asp-page="/Products/Details" asp-route-id="@Model.Id">View</a>
</div>
```

```html
@* Usage *@
@foreach (var product in Model.Products)
{
    <partial name="_ProductCard" model="product" />
}

@* Or with tag helper *@
<partial name="_ProductCard" model="Model.FeaturedProduct" />

@* Pass additional ViewData *@
<partial name="_ProductCard" model="product"
         view-data='new ViewDataDictionary(ViewData) { { "ShowActions", true } }' />
```

## Areas Organization

```
Areas/
├── Admin/
│   ├── Pages/
│   │   ├── _ViewStart.cshtml      @{ Layout = "_AdminLayout"; }
│   │   ├── Dashboard/
│   │   │   └── Index.cshtml
│   │   └── Users/
│   │       ├── Index.cshtml
│   │       └── Edit.cshtml
│   └── _AdminLayout.cshtml
└── Identity/
    └── Pages/
        └── Account/
            ├── Login.cshtml
            └── Register.cshtml
```

```html
@* Link to area page *@
<a asp-area="Admin" asp-page="/Dashboard/Index">Admin Dashboard</a>
<a asp-area="Identity" asp-page="/Account/Login">Login</a>
```

## TempData and Flash Messages

```csharp
// Set messages
TempData["Success"] = "Record saved successfully";
TempData["Error"] = "An error occurred";
TempData["Warning"] = "Please review your changes";

// In PageModel
public IActionResult OnPostDelete(int id)
{
    var result = _service.Delete(id);

    if (result.IsSuccess)
    {
        TempData["Success"] = $"Item {id} deleted";
        return RedirectToPage("./Index");
    }

    TempData["Error"] = result.Error;
    return RedirectToPage();
}
```

```html
@* _Layout.cshtml - Flash message partial *@
@if (TempData["Success"] is string success)
{
    <div class="alert alert-success alert-dismissible fade show">
        @success
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
}

@if (TempData["Error"] is string error)
{
    <div class="alert alert-danger alert-dismissible fade show">
        @error
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
}

@if (TempData["Warning"] is string warning)
{
    <div class="alert alert-warning alert-dismissible fade show">
        @warning
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
}
```
