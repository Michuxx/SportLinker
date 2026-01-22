import React, { useState, useEffect } from "react";
import "./searchInput.css";
import "./input.css";
import Dropdown from "../dropdown/Dropdown";
import useSearchCities from "../../../hooks/useSearchCities";
import useSearchPlaces from "../../../hooks/useSearchPlaces";

const SearchInput = ({
  icon,
  width,
  className = "",
  onCitySelect,
  placeholder,
  value,
  setValue,
  error,
  searchType,
  ...props
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const citySearch = useSearchCities(value);
  const placeSearch = useSearchPlaces(value);
  const [activeIndex, setActiveIndex] = useState(-1);

  const { suggestions, loading, search, setSuggestions } =
    searchType === "city" ? citySearch : placeSearch;

  useEffect(() => {
    setActiveIndex(-1);
  }, [suggestions]);

  const handleKeyDown = (e) => {
    if (suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0) {
        handleSelect(suggestions[activeIndex]);
        setActiveIndex(-1);
      }
    } else if (e.key === "Escape") {
      setActiveIndex(-1);
    }
  };

  useEffect(() => {
    if (!isTyping) return;

    const timeoutId = setTimeout(() => {
      search(value);
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [value, isTyping]);

  const handleSelect = (place) => {
    setValue(place.displayLabel);
    setSuggestions([]);
    setShowDropdown(false);
    setIsTyping(false);
    onCitySelect(place);
    console.log(place);
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
            type="text"
            placeholder={placeholder}
            value={value}
            autoComplete="off"
            onChange={(e) => {
              setValue(e.target.value);
              setIsTyping(true);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            // onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            onKeyDown={handleKeyDown}
          />

          {showDropdown && suggestions.length > 0 && (
            <div className="search-dropdown-wrapper">
              <Dropdown
                options={suggestions}
                textKey={"displayLabel"}
                onMouseDown={handleSelect}
                onClick={handleSelect}
                dropdownWidth={100}
                optionStyle="searchDropdownOptionButton"
                isScrollable={true}
                activeIndex={activeIndex}
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
