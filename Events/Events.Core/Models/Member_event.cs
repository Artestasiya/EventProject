using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Events.Core.Models
{
    public class Member_event
    {
        [Key]
        public int id_member_event { get; set; }
        [ForeignKey("Events")]
        public int id_event { get; set; }
        [ForeignKey("Member")]
        public int id_member { get; set; }
        public DateTime reg_date { get; set; }
    }
}