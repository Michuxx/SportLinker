import "./offerInfoPanel.css";

const OfferInfoBlock = ({ title, value }) => {
  return (
    <div className="offer-info-block-container">
      <span>{title}</span>
      <span>{value}</span>
    </div>
  );
};

export default OfferInfoBlock;
