using Events.Application.DTOs;
using Events.Application.Validators;
using FluentValidation;
using Xunit;

public class CategoryValidatorTests
{
    [Fact]
    public void Validate_InvalidCategory_ShouldReturnErrors()
    {
        var validator = new CategoryValidator();
        var invalidCategory = new CreateCategoryDto { Name = "", Description = "" };

        var result = validator.Validate(invalidCategory);

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "Name");
        Assert.Contains(result.Errors, e => e.PropertyName == "Description");
    }
}