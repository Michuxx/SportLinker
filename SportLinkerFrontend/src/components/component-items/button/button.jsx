import "./button.css";

const Button = ({ text, style, width, onClick }) => {
  const buttonType = {
    loginButton: "loginButton",
    createOfferButton: "createOfferButton",
    outlineButton: "outlineButton",
  };

  const buttonStyle = buttonType[style];

  return (
    <button
      className={buttonStyle}
      style={{ width: `${width}%` }}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
