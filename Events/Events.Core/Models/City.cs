using System.ComponentModel.DataAnnotations;

namespace Events.Core.Models
{
    public class City
    {
        [Key]
        public int id_city { get; set; }
        public string name { get; set; }
    }
}