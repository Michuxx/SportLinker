import React, { useState, useEffect } from "react";
import "./searchInput.css";
import "./input.css";
import Dropdown from "../dropdown/Dropdown";
import useSearchCities from "../../../hooks/useSearchCities";

const SearchInput = ({
  icon,
  width,
  type = "text",
  className = "",
  onCitySelect,
  placeholder,
  value,
  setValue,
  error,
  ...props
}) => {
  const getLocationValue = (city) =>
    city ? `${city.name}, ${city.state || ""}` : "";

  const [showDropdown, setShowDropdown] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const { suggestions, loading, search, setSuggestions } =
    useSearchCities(value);

  useEffect(() => {
    if (!isTyping) return;

    const timeoutId = setTimeout(() => {
      search(value);
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [value, isTyping]);

  const handleSelect = (city) => {
    setValue(getLocationValue(city));
    setSuggestions([]);
    setShowDropdown(false);
    setIsTyping(false);
    onCitySelect(city);
  };

  const inputClasses = [
    "standard-input",
    icon ? "standard-input-with-icon" : "",
    error ? "input-error" : "",
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
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
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

          {error && <p className="input-error-text">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default SearchInput;
