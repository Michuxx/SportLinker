import { useState } from "react";

const useSearchCities = () => {
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
        limit: "5",
        bbox: "14.1,49.0,24.1,54.9",
      });
      const url = `https://photon.komoot.io/api/?${params.toString()}&osm_tag=place:city&osm_tag=place:town`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Problem z połączeniem z API");

      const data = await response.json();

      const cities = data.features.map((feature) => {
        const p = feature.properties;
        const city = p.city || p.town || p.village || "";
        const name = p.name;
        const state = p.state;
        const country = p.country;
        const coordinates = feature.geometry.coordinates;
        const street = p.street || p.name || "";
        const houseNumber = p.housenumber || "";

        return {
          displayLabel: `${name}, ${state}`,
          country: country,
          type: p.type,
          coordinates: coordinates,
          name: name,
          city: city,
          street: street,
          houseNumber: houseNumber,
          state: state,
        };
      });

      console.log(cities);

      setSuggestions(cities);
    } catch (err) {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  return { suggestions, loading, search, setSuggestions };
};

export default useSearchCities;
