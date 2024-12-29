using Microsoft.EntityFrameworkCore;
using Xunit;
using Events.DataAccess;

public class DatabaseTests
{
    [Fact]
    public void ApplicationDbContext_ShouldHaveExpectedEntities()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: "Events")
            .Options;

        using var context = new ApplicationDbContext(options);

        // Act
        var categories = context.Category.ToList();

        // Assert
        Assert.NotNull(categories);
    }
}
