import "./feature.css";

const Feature = ({ Icon, title, description }) => {
  return (
    <div className="feature-wrapper">
      <div className="icon">{Icon}</div>
      <div className="feature-title">
        <h3>{title}</h3>
      </div>
      <div className="feature-description">
        <p>{description}</p>
      </div>
    </div>
  );
};

export default Feature;
