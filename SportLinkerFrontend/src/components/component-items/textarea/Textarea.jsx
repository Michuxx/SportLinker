import "./textarea.css";

const Textarea = ({
  placeholder,
  width,
  error,
  onChange,
  value,
  name,
  rows,
  maxLetters,
}) => {
  return (
    <div>
      <textarea
        className={`standard-textarea ` + (error && `textarea-error`)}
        placeholder={placeholder}
        style={{ width: `${width}%` }}
        onChange={onChange}
        value={value}
        name={name}
        rows={rows}
      ></textarea>
      <div className="additional-info-textarea">
        {error && <p className="textarea-error-text">{error}</p>}
        <p className={`word-counter ` + (error && `textarea-error-text`)}>
          {value.length}/{maxLetters}
        </p>
      </div>
    </div>
  );
};

export default Textarea;
