import React, { useState, useEffect, useRef } from "react";
import "./searchInput.css";
import "./input.css";
import Dropdown from "../dropdown/Dropdown";
import useSearchCities from "../../../hooks/useSearchCities";

const SearchInput = ({
  icon,
  error: propError, // Zmiana nazwy, by nie kolidowała z błędem z hooka
  width,
  type = "text",
  className = "",
  onCitySelect,
  placeholder,
  value,
  ...props
}) => {
  const getLocationValue = (city) =>
    city ? `${city.name}, ${city.state || ""}` : "";

  const [query, setQuery] = useState(getLocationValue(value));
  const [showDropdown, setShowDropdown] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const {
    suggestions,
    loading,
    error: apiError,
    search,
    setSuggestions,
  } = useSearchCities(query);

  useEffect(() => {
    if (!isTyping) return;

    const timeoutId = setTimeout(() => {
      search(query);
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [query, isTyping]);

  const handleSelect = (city) => {
    setQuery(getLocationValue(city));
    setSuggestions([]);
    setShowDropdown(false);
    setIsTyping(false);
    if (onCitySelect) onCitySelect(city);
  };

  const inputClasses = [
    "standard-input",
    icon ? "standard-input-with-icon" : "",
    propError || apiError ? "input-error" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

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
              setIsTyping(true);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          />

          {showDropdown && suggestions.length > 0 && (
            <div className="search-dropdown-wrapper">
              <Dropdown
                options={suggestions}
                textKey="name"
                onMouseDown={handleSelect}
                onClick={handleSelect}
                dropdownWidth={100}
                optionStyle="searchDropdownOptionButton"
              />
            </div>
          )}

          {(propError || apiError) && (
            <p className="input-error-text">{propError || apiError}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchInput;
