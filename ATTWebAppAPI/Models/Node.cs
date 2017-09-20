using System;

namespace ATTWebAppAPI.Models
{
    public class Node
    {
        public int NodeId { get; set; }
        public int SarfId { get; set; }
        public int HubId { get; set; }
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
        public string AtollSiteName { get; set; }
        public string iPlanJobNumber { get; set; }
        public string PaceNumber { get; set; }
        public string NodeType { get; set; }
        public string VendorName { get; set; }
        public string ContactPolice { get; set; }
        public string ContactFire { get; set; }
        public string ContactEnergy { get; set; }
        public string BusinessPhone {get; set;}
        public string IsATTOwned { get; set; }
        public string StructureHeight { get; set; }
        public string Company { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
    }
}