import "./avatar.css";
import { LuUser } from "react-icons/lu";

const Avatar = ({ size  }) => {
  return (
    <div className="avatar" style={{height: `${size}rem`, width: `${size}rem`}}>
        <LuUser size={size*7.5} color="white" />
  </div>
  );
};

export default Avatar;
