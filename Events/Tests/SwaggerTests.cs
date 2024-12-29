using System.Net.Http;
using System.Threading.Tasks;
using Xunit;

public class SwaggerTests
{
    private readonly HttpClient _client = new HttpClient();

    [Fact]
    public async Task SwaggerUI_ShouldBeAccessible()
    {
        // Arrange
        var url = "https://localhost:5001/swagger";

        // Act
        var response = await _client.GetAsync(url);

        // Assert
        Assert.True(response.IsSuccessStatusCode);
    }
}
