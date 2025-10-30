import "./dropdown.css";
import Button from "../button/button";

const Dropdown = ({ options }) => {
  return (
    <div className="dropdown-wrapper">
      {options.map((option, index) => (
        <div className="option-wrapper" key={index}>
          <Button
            style={option.style}
            width={100}
            onClick={option.onClick}
            Icon={option.icon}
          >
            {option.text}
          </Button>
          {index < options.length - 1 && <hr />}
        </div>
      ))}
    </div>
  );
};

export default Dropdown;
