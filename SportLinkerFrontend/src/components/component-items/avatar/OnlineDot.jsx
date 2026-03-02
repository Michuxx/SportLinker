import "./avatar.css";

const OnlineDot = ({ size }) => {
  const dotSize = size / 3.5;
  return (
    <div
      className="online-dot-wrapper"
      style={{ width: `${dotSize}rem`, height: `${dotSize}rem` }}
    ></div>
  );
};

export default OnlineDot;
