using Xunit;
using Events.Application.Validators;
using Events.Application.DTOs;
using FluentValidation;

public class CategoryValidatorTests
{
    [Fact]
    public void Validate_InvalidCategory_ShouldReturnErrors()
    {
        // Arrange
        var validator = new CategoryValidator();
        var invalidCategory = new CreateCategoryDto { Name = "", Description = "" };

        // Act
        var result = validator.Validate(invalidCategory);

        // Assert
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "Name");
        Assert.Contains(result.Errors, e => e.PropertyName == "Description");
    }
}
