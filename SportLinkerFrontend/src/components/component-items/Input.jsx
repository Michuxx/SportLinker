import "./input.css";

const Input = ({ placeholder, type, icon }) => {
  return icon ? (
    <div className="input-wrapper">
      <img src={icon} alt={`${placeholder} icon`} />
      <input
        className="standard-input-with-icon"
        type={type}
        placeholder={placeholder}
      />
    </div>
  ) : (
    <input className="standard-input" type={type} placeholder={placeholder} />
  );
};

export default Input;
