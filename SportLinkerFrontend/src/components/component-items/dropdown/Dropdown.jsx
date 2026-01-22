import "./dropdown.css";
import Button from "../button/button";
import { useEffect, useRef } from "react";

const Dropdown = ({
  options,
  onMouseDown,
  onClick,
  optionStyle,
  icon,
  textKey,
  dropdownWidth,
  isScrollable,
  activeIndex,
}) => {
  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  };

  const dropdownRef = useRef(null);

  useEffect(() => {
    if (activeIndex !== -1 && dropdownRef.current) {
      const activeElement = dropdownRef.current.childNodes[activeIndex];
      if (activeElement) {
        activeElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [activeIndex]);

  return (
    <div
      ref={dropdownRef}
      className="dropdown-wrapper"
      style={{
        width: `${dropdownWidth}%`,
        overflowY: isScrollable && "auto",
        maxHeight: isScrollable && "10rem",
      }}
    >
      {options.map((option, index) => {
        const baseClass = option.style || optionStyle;

        const finalClass =
          index === activeIndex ? `${baseClass}ActiveOption` : baseClass;

        return (
          <div className="option-wrapper" key={index}>
            <Button
              style={finalClass}
              width={100}
              onClick={() =>
                option.onClick ? option.onClick() : onClick?.(option)
              }
              onMouseDown={() =>
                option.onMouseDown
                  ? option.onMouseDown()
                  : onMouseDown?.(option)
              }
              Icon={option.icon || icon}
            >
              {getNestedValue(option, textKey)}
            </Button>
            {index < options.length - 1 && <hr />}
          </div>
        );
      })}
    </div>
  );
};

export default Dropdown;
