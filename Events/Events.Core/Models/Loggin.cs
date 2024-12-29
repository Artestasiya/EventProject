using System.ComponentModel.DataAnnotations;

namespace Events.Core.Models
{
    public class Loggin
    {
        [Key]
        public int id_loggin { get; set; }
        public string email { get; set; }
        public string password { get; set; }
        public bool role { get; set; }
    }
}