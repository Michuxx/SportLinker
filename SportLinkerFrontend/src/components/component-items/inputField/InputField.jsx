import "./inputField.css";

const InputField = ({ label, children, error }) => {
  return (
    <div className="input-field-wrapper">
      <p>{label}</p>
      {children}
      {error && <span>{error}</span>}
    </div>
  );
};

export default InputField;
