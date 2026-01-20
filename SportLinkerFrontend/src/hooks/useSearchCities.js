import { useState } from "react";

const useSearchCities = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = async (query) => {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 3) {
      setSuggestions([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

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

      const cities = data.features
        .map((feature) => ({
          name: feature.properties.name,
          state: feature.properties.state,
          country: feature.properties.country,
          coordinates: feature.geometry.coordinates,
        }))
        .filter(
          (v, i, a) => a.findIndex((t) => t.fullLabel === v.fullLabel) === i
        )
        .slice(0, 5);

      setSuggestions(cities);
    } catch (err) {
      setError("Nie udało się pobrać miast. Spróbuj ponownie.");
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  return { suggestions, loading, error, search, setSuggestions };
};

export default useSearchCities;
