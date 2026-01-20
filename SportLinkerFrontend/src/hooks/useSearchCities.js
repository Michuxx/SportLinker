import { useState } from "react";

const useSearchCities = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorApi, setErrorApi] = useState(null);

  const search = async (query, enableError) => {
    const trimmedQuery = query.trim();

    if (enableError && trimmedQuery.length === 0) {
      setSuggestions([]);
      setErrorApi("Lokalizacja nie może być pusta. Wybierz ją z listy");
      return;
    }

    if (trimmedQuery.length < 3) {
      setSuggestions([]);
      setErrorApi(null);
      return;
    }

    setLoading(true);
    setErrorApi(null);

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
      setErrorApi("Nie udało się pobrać miast. Spróbuj ponownie.");
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  return { suggestions, loading, errorApi, search, setSuggestions };
};

export default useSearchCities;
