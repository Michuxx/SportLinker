import "./offerCard.css";
import { FiLock } from "react-icons/fi";
import { FiUnlock } from "react-icons/fi";

const OfferCardMode = ({ mode }) => {
  const modeType = {
    open: ["otwarty", <FiUnlock size="22px" color="#3b82f6" />],
    closed: ["zamknięty", <FiLock size="22px" color="#3b82f6" />],
  };

  const modeInfo = modeType[mode];

  return (
    <div>
      {modeInfo[1]}
      <p>Tryb: {modeInfo[0]}</p>
    </div>
  );
};

export default OfferCardMode;
