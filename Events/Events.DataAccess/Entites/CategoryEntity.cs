
using System.ComponentModel.DataAnnotations;

namespace Events.DataAccess.Entites
{
    public class CategoryEntity
    {
        [Key]
        public int Id_category { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }
}