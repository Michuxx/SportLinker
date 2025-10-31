import "./userHeader.css";
import { LuUser } from "react-icons/lu";
import { FiMail } from "react-icons/fi";
import Button from "../../../component-items/button/button";
import { FaRegAddressCard } from "react-icons/fa6";

const UserHeader = ({ name, mail }) => {
  return (
    <div className="user-header-wrapper">
      <div className="user-header-info-wrapper">
        <div className="user-header-detailed-wrapper">
          <div className="user-header-avatar">
            <LuUser size={36} color="white" />
          </div>
          <div className="user-header-info">
            <h1>{name}</h1>
            <div className="user-header-mail">
              <FiMail />
              <p>{mail}</p>
            </div>
          </div>
        </div>
        <div className="user-header-btn-wrapper">
          <Button
            style="classicBlueButton"
            Icon={<FaRegAddressCard size={16} />}
          >
            Edytuj
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
