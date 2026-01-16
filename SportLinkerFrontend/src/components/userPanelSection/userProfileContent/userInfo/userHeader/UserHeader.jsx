import "./userHeader.css";
import Avatar from "../../../../component-items/avatar/Avatar";
import UserHeaderInfo from "./userHeaderInfo/UserHeaderInfo";

const UserHeader = ({ name, birthDate, location, gender }) => {
  return (
    <div className="user-header-wrapper">
      <div className="user-header-banner"></div>
      <div className="user-header-info-wrapper">
        <div className="user-header-detailed-wrapper">
          <div className="avatar-white-bg">
            <Avatar size={8} />
          </div>
          <div className="user-header-info">
            <h1>{name}</h1>
            <UserHeaderInfo
              birthDate={birthDate}
              location={location}
              gender={gender}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
