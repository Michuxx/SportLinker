import "./nullComponent.css";

const NullComponent = ({ title, text, icon, children }) => {
  return (
    <div className="null-component-wrapper">
      <div className="null-icon-bg">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
      {children}
    </div>
  );
};

export default NullComponent;
