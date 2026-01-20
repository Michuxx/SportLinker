import "./dropdown.css";
import Button from "../button/button";

const Dropdown = ({
  options,
  onMouseDown,
  onClick,
  optionStyle,
  icon,
  textKey,
  dropdownWidth,
}) => {
  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  };

  return (
    <div className="dropdown-wrapper" style={{ width: `${dropdownWidth}%` }}>
      {options.map((option, index) => (
        <div className="option-wrapper" key={index}>
          <Button
            style={option.style || optionStyle}
            width={100}
            onClick={() =>
              option.onClick ? option.onClick() : onClick?.(option)
            }
            onMouseDown={() =>
              option.onMouseDown ? option.onMouseDown() : onMouseDown?.(option)
            }
            Icon={option.icon || icon}
          >
            {getNestedValue(option, textKey)}
          </Button>
          {index < options.length - 1 && <hr />}
        </div>
      ))}
    </div>
  );
};

export default Dropdown;
