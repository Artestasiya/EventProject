using DocumentFormat.OpenXml.Drawing.Diagrams;
using System.ComponentModel.DataAnnotations;

namespace Events.Core.Models
{
    public class Category
    {
        public const int MAX_NAME_LENGTH = 250;

        [Key]
        public int Id_category { get; }
        public string Name { get; }
        public string Description { get; }

        public Category(int id_category, string name, string description)
        {
            if (string.IsNullOrEmpty(name) || name.Length > MAX_NAME_LENGTH)
            {
                throw new ArgumentException("Name cannot be empty or longer than 250 symbols.", nameof(name));
            }
            Id_category = id_category;
            Name = name;
            Description = description;
        }
    }
}
