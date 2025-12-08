import "./offerInfoPanel.css";

const OfferInfoBlock = ({ title, value, additionalCss }) => {
  return (
    <div className="offer-info-block-container">
      <span>{title}</span>
      <span className={additionalCss}>{value}</span>
    </div>
  );
};

export default OfferInfoBlock;
