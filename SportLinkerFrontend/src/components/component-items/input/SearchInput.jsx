import { useState, useEffect, useRef } from "react";
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
  const citySearch = useSearchCities();
  const placeSearch = useSearchPlaces();
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  const { suggestions, loading, search, setSuggestions, cancelSearch } =
    searchType === "city" ? citySearch : placeSearch;
  const searchRef = useRef(search);
  useEffect(() => { searchRef.current = search; }, [search]);
  useEffect(() => {
    if (value.trim()) return;
    cancelSearch?.();
    setSuggestions([]);
    setShowDropdown(false);
    setIsTyping(false);
  }, [value, cancelSearch, setSuggestions]);
  useEffect(() => {
    const close = (event) => {
      if (!containerRef.current?.contains(event.target)) setShowDropdown(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);

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
        e.preventDefault();
        handleSelect(suggestions[activeIndex]);
        setActiveIndex(-1);
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      setActiveIndex(-1);
    }
  };

  useEffect(() => {
    if (!isTyping) return;

    const timeoutId = setTimeout(() => {
      searchRef.current(value);
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [value, isTyping, searchType]);

  const handleSelect = (place) => {
    setValue(place.displayLabel);
    setSuggestions([]);
    cancelSearch?.();
    setShowDropdown(false);
    setIsTyping(false);
    onCitySelect?.(place);
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
    <div className="city-search-container" ref={containerRef}>
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
              cancelSearch?.();
              setSuggestions([]);
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
          {showDropdown && loading && <div className="search-dropdown-wrapper search-input-loading" role="status">Szukam lokalizacji...</div>}

          {error && <p className="input-error-text">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default SearchInput;
