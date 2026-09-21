using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities
{
    public class Location
    {
        public int Id { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string? Country { get; set; }
        public string? State { get; set; }
        public string? City { get; set; }
        public string? Name { get; set; }
        public string? Street { get; set; }
        public string? HouseNumber { get; set; }
        public string? Type { get; set; }

    }
}
