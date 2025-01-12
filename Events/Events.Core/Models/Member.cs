using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Events.Core.Models
{
    public class Member
    {
        [Key]
        public int id_member { get; set; }
        public string name { get; set; }
        public string surname { get; set; }
        public string Email { get; set; }
    }
}