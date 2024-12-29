using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Events.Core.Models
{
    public class Place
    {
        [Key]
        public int id_place { get; set; }
        public string name { get; set; }
        [ForeignKey("City")]
        public int id_city { get; set; }
    }
}
