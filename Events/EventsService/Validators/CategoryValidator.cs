using Events.Application.DTOs;
using FluentValidation;

namespace Events.Application.Validators
{
    public class CategoryValidator : AbstractValidator<CreateCategoryDto>
    {
        public CategoryValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Name is required.")
                .MaximumLength(255).WithMessage("Name cannot exceed 255 characters.");
            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("Description is required.");
        }
    }
}