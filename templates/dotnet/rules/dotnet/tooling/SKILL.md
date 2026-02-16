---
name: .NET Tooling
description: Essential tooling for .NET development and CI/CD.
metadata:
  labels: [dotnet, tooling, testing, build, nuget]
  triggers:
    files: ['**/*.csproj', '**/*.sln', '.editorconfig', 'Directory.Build.props']
    keywords: [PackageReference, dotnet, test, build, publish]
---

# .NET Tooling

## **Priority: P1 (OPERATIONAL)**

Essential tooling for .NET development, testing, and CI/CD.

## Implementation Guidelines

- **Project Files**: SDK-style `.csproj`. Use `Directory.Build.props` for shared settings.
- **Central Package Management**: `Directory.Packages.props` for version consistency.
- **Testing**: xUnit or NUnit. FluentAssertions for readable assertions. Moq for mocking.
- **Code Analysis**: Enable built-in analyzers. Consider StyleCop, SonarQube.
- **Build**: `dotnet build`, `dotnet publish`. Use Release config for production.
- **EditorConfig**: Consistent code style across team.
- **CI/CD**: GitHub Actions, Azure DevOps, or GitLab CI.

## Anti-Patterns

- **No `packages.config`**: Migrate to `PackageReference`.
- **No skipping tests in CI**: Tests must pass before merge.
- **No ignoring warnings**: Fix or suppress with documented justification.
- **No floating versions**: Pin versions (`8.0.0`, not `8.*`).

## Code

```xml
<!-- Directory.Build.props (shared across all projects) -->
<Project>
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
    <AnalysisLevel>latest-recommended</AnalysisLevel>
  </PropertyGroup>
</Project>

<!-- Directory.Packages.props (Central Package Management) -->
<Project>
  <PropertyGroup>
    <ManagePackageVersionsCentrally>true</ManagePackageVersionsCentrally>
  </PropertyGroup>
  <ItemGroup>
    <PackageVersion Include="Microsoft.EntityFrameworkCore" Version="8.0.0" />
    <PackageVersion Include="FluentValidation" Version="11.9.0" />
    <PackageVersion Include="xunit" Version="2.6.6" />
  </ItemGroup>
</Project>
```

```csharp
// xUnit test with FluentAssertions
public class UserServiceTests
{
    [Fact]
    public async Task GetUser_WithValidId_ReturnsUser()
    {
        // Arrange
        var mockRepo = new Mock<IUserRepository>();
        mockRepo.Setup(r => r.GetByIdAsync(1, default))
            .ReturnsAsync(new User { Id = 1, Name = "Test" });
        var sut = new UserService(mockRepo.Object);

        // Act
        var result = await sut.GetUserAsync(1);

        // Assert
        result.Should().NotBeNull();
        result!.Name.Should().Be("Test");
        mockRepo.Verify(r => r.GetByIdAsync(1, default), Times.Once);
    }
}
```

## Reference & Examples

For CI/CD configuration and Docker setup:
See [references/REFERENCE.md](references/REFERENCE.md).

## Related Topics

language | best-practices | security
