import "./button.css";

const Button = ({ text, style, width, onClick, Icon }) => {
  const buttonType = {
    loginButton: "loginButton",
    createOfferButton: "createOfferButton",
    outlineButton: "outlineButton",
    modalCloseButton: "modalCloseButton",
  };

  const buttonStyle = buttonType[style];

  return (
    <button
      className={buttonStyle}
      style={{ width: `${width}%` }}
      onClick={onClick}
    >
      {Icon || ""}
      {text || ""}
    </button>
  );
};

export default Button;
