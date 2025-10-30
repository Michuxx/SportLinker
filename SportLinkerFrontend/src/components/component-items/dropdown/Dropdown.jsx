import "./dropdown.css";
import Button from "../button/button";

const Dropdown = ({ options }) => {
  return (
    <div className="dropdown-wrapper">
      {options.map((option) => (
        <div className="option-wrapper" key={option.index}>
          <Button
            style={option.style}
            width={100}
            onClick={option.onClick}
            Icon={option.icon}
          >
            {option.text}
          </Button>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default Dropdown;
