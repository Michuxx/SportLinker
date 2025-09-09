import "./input.css";

const Input = ({ placeholder, type, icon, width }) => {
  return icon ? (
    <div className="input-wrapper">
      <img src={icon} alt={`${placeholder} icon`} />
      <input
        className="standard-input standard-input-with-icon"
        type={type}
        placeholder={placeholder}
        style={{ width: `${width}%` }}
      />
    </div>
  ) : (
    <input
      className="standard-input"
      type={type}
      placeholder={placeholder}
      style={{ width: `${width}%` }}
    />
  );
};

export default Input;
