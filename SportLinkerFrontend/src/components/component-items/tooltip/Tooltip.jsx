import React, { useState } from "react";
import "./tooltip.css";

const Tooltip = ({ direction, icon, text }) => {
  const [active, setActive] = useState(false);

  const showTip = () => {
    setActive(true);
  };

  const hideTip = () => {
    setActive(false);
  };

  return (
    <div
      className="Tooltip-Wrapper"
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
    >
      {icon}
      {active && (
        <div className={`Tooltip-Tip ${direction || "top"}`}>{text}</div>
      )}
    </div>
  );
};

export default Tooltip;
