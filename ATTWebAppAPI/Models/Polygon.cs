using System;

namespace ATTWebAppAPI.Models
{
    public class Polygon
    {
        public int Id { set; get; }
        public int SarfId { set; get; }
        public string Vertices { set; get; }
        public string AreaInSqKm { set; get; }
        public DateTime? CreatedDate { set; get; }
        public DateTime? ModifiedDate { set; get; }
    }

    public class LatLong
    {
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
    }
}