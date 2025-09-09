import "./inputField.css";

const InputField = ({ label, children }) => {
  return (
    <div className="input-field-wrapper">
      <p>{label}</p>
      {children}
    </div>
  );
};

export default InputField;
