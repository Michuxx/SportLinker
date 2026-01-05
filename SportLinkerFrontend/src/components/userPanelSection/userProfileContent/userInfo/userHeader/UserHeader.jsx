import "./userHeader.css";
import Avatar from "../../../../component-items/avatar/Avatar";
import UserHeaderInfo from "./userHeaderInfo/UserHeaderInfo";

const UserHeader = ({ name, creationDate, location }) => {
  return (
    <div className="user-header-wrapper">
      <div className="user-header-banner"></div>
      <div className="user-header-info-wrapper">
        <div className="user-header-detailed-wrapper">
          <Avatar size={8} />
          <div className="user-header-info">
            <h1>{name}</h1>
            <UserHeaderInfo creationDate={creationDate} location={location} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
