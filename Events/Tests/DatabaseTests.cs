using Events.DataAccess;
using Microsoft.EntityFrameworkCore;
using Xunit;

public class DatabaseTests
{
    [Fact]
    public void ApplicationDbContext_ShouldHaveExpectedEntities()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: "Events")
            .Options;

        using var context = new ApplicationDbContext(options);

        var categories = context.Category.ToList();

        Assert.NotNull(categories);
    }
}