import { useState } from "react";

const useSearchPlaces = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async (query) => {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);

    try {
      const params = new URLSearchParams({
        q: trimmedQuery,
        limit: "40",
        bbox: "14.1,49.0,24.1,54.9",
      });
      const url = `https://photon.komoot.io/api/?${params.toString()}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Problem z połączeniem z API");

      const data = await response.json();

      const places = data.features
        .filter((f) => {
          const t = f.properties.type;
          return (
            t === "house" || t === "street" || t === "amenity" || t === "poi"
          );
        })
        .map((feature) => {
          const p = feature.properties;
          const city = p.city || p.town || p.village || "";
          const street = p.street || p.name || "";
          const houseNumber = p.housenumber || "";
          const name = p.name;
          const state = p.state;
          const country = p.country;
          const addressLine = houseNumber ? `${street} ${houseNumber}` : street;
          const labelParts = [];
          if (city) labelParts.push(city);
          if (addressLine && addressLine !== city) labelParts.push(addressLine);

          return {
            displayLabel: labelParts.join(", "),
            country: country,
            type: p.type,
            coordinates: feature.geometry.coordinates,
            name: name,
            city: city,
            street: street,
            houseNumber: houseNumber,
            state: state,
          };
        })
        .filter(
          (v, i, a) =>
            a.findIndex((t) => t.displayLabel === v.displayLabel) === i
        )
        .sort((a, b) => {
          if (a.type === "house" && b.type !== "house") return -1;
          if (a.type !== "house" && b.type === "house") return 1;
          return 0;
        })
        .slice(0, 8);

      console.log(places);

      setSuggestions(places);
    } catch (err) {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  return { suggestions, loading, search, setSuggestions };
};

export default useSearchPlaces;
