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
        limit: "8",
        bbox: "14.1,49.0,24.1,54.9",
      });
      const url = `https://photon.komoot.io/api/?${params.toString()}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Problem z połączeniem z API");

      const data = await response.json();

      const places = data.features
        .map((feature) => ({
          name: feature.properties.name,
          houseNumber: feature.properties.housenumber
            ? `${feature.properties.housenumber}`
            : null,
          state: feature.properties.state,
          country: feature.properties.country,
          coordinates: feature.geometry.coordinates,
          postCode: feature.properties.postcode
            ? `${feature.properties.postcode}`
            : null,
          city:
            feature.properties.city ||
            feature.properties.town ||
            feature.properties.village,
        }))
        .filter(Boolean);

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
