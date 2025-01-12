using System.Net.Http;
using System.Threading.Tasks;
using Xunit;

public class SwaggerTests
{
    private readonly HttpClient _client = new HttpClient();

    [Fact]
    public async Task SwaggerUI_ShouldBeAccessible()
    {
        var url = "https://localhost:5001/swagger";

        var response = await _client.GetAsync(url);

        Assert.True(response.IsSuccessStatusCode);
    }
}