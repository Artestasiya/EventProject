using DocumentFormat.OpenXml.Drawing.Diagrams;
using System.ComponentModel.DataAnnotations;

namespace Events.Core.Models
{

    public class Category
    {
        public const int MAX_NAME_LENGTH = 250;
        private Category(int id_category, string name, string description)
        {
            Id_category = id_category;
            Name = name;
            Description = description;
        }
        [Key]
        public int Id_category { get; }
        public string Name { get; }
        public string Description { get;}
    
    public static (Category Category, string Error) Create(int id_category, string name, string description)
        {
            var error = string.Empty;
            if (string.IsNullOrEmpty(name) || name.Length > MAX_NAME_LENGTH)
            {
                error = "Name can not be empty or longer then 250 symbols";
            }
            var category = new Category(id_category, name, description);
            return (category,error);
        }
    }
}