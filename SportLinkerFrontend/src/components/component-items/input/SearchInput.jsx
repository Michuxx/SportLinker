import React, { useState, useEffect } from "react";
import "./searchInput.css";
import "./input.css";

const SearchInput = ({
  icon,
  error,
  width,
  type = "text",
  className = "",
  onCitySelect,
  placeholder,
  ...props
}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const inputClasses = [
    "standard-input",
    icon ? "standard-input-with-icon" : "",
    error ? "input-error" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  useEffect(() => {
    const fetchCities = async () => {
      const trimmedQuery = query.trim();
      if (trimmedQuery.length < 3) {
        setSuggestions([]);
        return;
      }

      try {
        const params = new URLSearchParams({
          q: trimmedQuery,
          limit: "5", // Pobieramy więcej, by filtr lokalny miał z czego wybierać
        });
        const url = `https://photon.komoot.io/api/?${params.toString()}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error("API Error");

        const data = await response.json();

        // Skuteczniejsze filtrowanie miast
        const cities = data.features
          .filter(
            (f) =>
              f.properties.type === "city" ||
              f.properties.osm_value === "city" ||
              f.properties.city ||
              f.properties.extent // Miasta zazwyczaj mają zdefiniowany obszar (extent)
          )
          .map((feature) => ({
            name: feature.properties.name,
            country: feature.properties.country,
            state:
              feature.properties.state ||
              feature.properties.county ||
              feature.properties.district,
            coordinates: feature.geometry.coordinates,
          }))
          // Usuwanie duplikatów (np. jeśli API zwróci to samo miasto dwa razy)
          .filter(
            (v, i, a) =>
              a.findIndex((t) => t.name === v.name && t.state === v.state) === i
          )
          .slice(0, 5); // Pokazujemy max 5 finalnych wyników

        setSuggestions(cities);
      } catch (err) {
        console.error("Błąd API:", err.message);
      }
    };

    const timeoutId = setTimeout(fetchCities, 400);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = (city) => {
    const fullText = `${city.name}, ${city.country}`;
    setQuery(fullText);
    setSuggestions([]);
    setShowDropdown(false);
    if (onCitySelect) onCitySelect(city);
  };

  return (
    <div
      className="city-search-container"
      style={{ width: width ? `${width}%` : "100%" }}
    >
      <div className={`input-wrapper ${icon ? "has-icon" : ""}`}>
        {icon && <span className="input-icon-wrapper">{icon}</span>}

        <div className="input-error-wrapper">
          <input
            {...props}
            className={inputClasses}
            type={type}
            placeholder={placeholder}
            value={query}
            autoComplete="off"
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          />

          {showDropdown && suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((city, index) => (
                <li
                  key={`${city.name}-${index}`}
                  onMouseDown={() => handleSelect(city)}
                  className="suggestion-item"
                >
                  <span className="city-name">{city.name}</span>
                </li>
              ))}
            </ul>
          )}
          {error && <p className="input-error-text">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default SearchInput;
