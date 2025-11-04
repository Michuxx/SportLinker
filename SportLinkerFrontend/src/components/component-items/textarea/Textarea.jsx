import "./textarea.css";

const Textarea = ({
  placeholder,
  width,
  conditionalClass,
  onChange,
  value,
  name,
  rows,
}) => {
  return (
    <textarea
      className={`standard-textarea ` + (conditionalClass && `textarea-error`)}
      placeholder={placeholder}
      style={{ width: `${width}%` }}
      onChange={onChange}
      value={value}
      name={name}
      rows={rows}
    ></textarea>
  );
};

export default Textarea;
