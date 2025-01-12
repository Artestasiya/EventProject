using Events.DataAccess.Entites;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Events.DataAccess.Configurations
{
    public class CategoryConfiguration : IEntityTypeConfiguration<CategoryEntity>
    {
        public void Configure(EntityTypeBuilder<CategoryEntity> builder)
        {
            builder.HasKey(c => c.Id_category);
            builder.Property(c => c.Name)
                .HasMaxLength(255)
                .IsRequired();
            builder.Property(c => c.Description)
                .IsRequired();
        }
    }
}