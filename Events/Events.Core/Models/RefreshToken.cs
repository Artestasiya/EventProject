using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Events.Core.Models
{
    public class RefreshToken
    {
        public int Id { get; set; }
        public string Token { get; set; }
        public string Email { get; set; }
        public DateTime Expiration { get; set; }
        public bool IsRevoked { get; set; }
    }

}