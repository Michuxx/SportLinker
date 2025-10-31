import "./userInfo.css";
import { LuUser } from "react-icons/lu";
import { FiMail } from "react-icons/fi";
import Button from "../../component-items/button/button";

const UserInfo = () => {
  return (
    <div className="user-info-wrapper">
      <div className="user-name-info-wrapper">
        <div className="user-name-detailed-wrapper">
          <div className="user-name-avatar">
            <LuUser size={36} color="white" />
          </div>
          <div className="user-name-info">
            <h1>Imie i nazwisko</h1>
            <div className="user-name-info-mail">
              <FiMail />
              <p>John@example.pl</p>
            </div>
          </div>
        </div>
        <div className="user-name-btn-wrapper">
          <Button>Edytuj</Button>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
