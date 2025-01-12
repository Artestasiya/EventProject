using AutoMapper;
using Events.Application.Mappings;
using Xunit;

public class MappingProfileTests
{
    [Fact]
    public void MappingProfile_IsValid()
    {
        var configuration = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());

        configuration.AssertConfigurationIsValid();
    }
}