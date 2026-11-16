import { useCallback, useEffect, useRef, useState } from "react";

const useSearchCities = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const controllerRef = useRef(null);

  const cancelSearch = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setLoading(false);
  }, []);
  useEffect(() => () => controllerRef.current?.abort(), []);

  const search = useCallback(async (query) => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 3) { setSuggestions([]); setLoading(false); return; }
    setLoading(true);
    setSuggestions([]);
    try {
      const params = new URLSearchParams({ q: trimmedQuery, limit: "5", bbox: "14.1,49.0,24.1,54.9" });
      const response = await fetch(`https://photon.komoot.io/api/?${params}&osm_tag=place:city&osm_tag=place:town`, { signal: controller.signal });
      if (!response.ok) throw new Error("Problem z połączeniem z API");
      const data = await response.json();
      const cities = data.features.map(({ properties: p, geometry }) => {
        const city = p.city || p.town || p.village || p.name || "";
        return { displayLabel: [p.name || city, p.state].filter(Boolean).join(", "), country: p.country, type: p.type,
          long: geometry.coordinates[0], lat: geometry.coordinates[1], name: p.name || city, city, street: p.street || "", houseNumber: p.housenumber || "", state: p.state };
      });
      if (!controller.signal.aborted) setSuggestions(cities.filter((city, index, all) => all.findIndex((item) => item.displayLabel === city.displayLabel && item.country === city.country) === index));
    } catch {
      if (!controller.signal.aborted) setSuggestions([]);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, []);

  return { suggestions, loading, search, setSuggestions, cancelSearch };
};
export default useSearchCities;
