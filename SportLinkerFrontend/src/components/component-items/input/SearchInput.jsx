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
          limit: "5",
          osm_tag: "place:city",
          bbox: "14.1,49.0,24.1,54.9", // Only show Polish towns
        });
        const url = `https://photon.komoot.io/api/?${params.toString()}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error("API Error");

        const data = await response.json();
        const cities = data.features
          .filter((f) => f.properties.type === "city")
          .map((feature) => ({
            name: feature.properties.name,
            country: feature.properties.country,
            state: feature.properties.state,
            coordinates: feature.geometry.coordinates,
          }));

        setSuggestions(cities);
      } catch (err) {
        console.error("Błąd API:", err.message);
      }
    };

    const timeoutId = setTimeout(fetchCities, 400);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = (city) => {
    const fullText = `${city.name}, ${city.state}`;
    setQuery(fullText);
    setSuggestions([]);
    setShowDropdown(false);
    if (onCitySelect) onCitySelect(city);
  };

  return (
    <div className="city-search-container">
      <div className={`input-wrapper ${icon ? "has-icon" : ""}`}>
        {icon && <span className="input-icon-wrapper">{icon}</span>}

        <div className="input-error-wrapper">
          <input
            {...props}
            style={{ width: `${width}%` }}
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
