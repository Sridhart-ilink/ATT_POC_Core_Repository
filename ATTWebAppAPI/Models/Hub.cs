using System;

namespace ATTWebAppAPI.Models
{
    public class Hub
    {
        public int HubId { get; set; }
        public int SarfId { get; set; }
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
        public string Address { get; set; }
        public string HubType { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
    }
}