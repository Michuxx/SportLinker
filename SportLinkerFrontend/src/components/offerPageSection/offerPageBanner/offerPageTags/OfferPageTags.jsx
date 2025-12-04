import "./offerPageTags.css";
import OfferPageTag from "../../../component-items/tags/OfferPageTag";

const OfferPageTags = ({ sport, level, mode }) => {
  return (
    <div className="offer-tags-container">
      <OfferPageTag styleType={"sport"} text={sport} />
      <OfferPageTag styleType={level} />
      <OfferPageTag styleType={mode} />
    </div>
  );
};

export default OfferPageTags;
