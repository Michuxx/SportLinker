import "./userHeader.css";
import Avatar from "../../../../component-items/avatar/Avatar";
import UserHeaderInfo from "./userHeaderInfo/UserHeaderInfo";
import UserBanner from "./userHeaderInfo/userBanner/UserBanner";

const UserHeader = ({
  userName,
  name,
  birthDate,
  location,
  gender,
  changeProfileImage,
  profileImage,
  changeBackgroundImage,
  backgroundImage,
  isOwner = false,
}) => {
  const displayName = userName || name || "Użytkownik";

  return (
    <div className="user-header-wrapper">
      <UserBanner
        bannerImage={backgroundImage}
        changeBackgroundImage={isOwner ? changeBackgroundImage : undefined}
      />
      <div className="user-header-info-wrapper">
        <div className="user-header-detailed-wrapper">
          <div className="avatar-white-bg">
            <Avatar
              size={8}
              onImageSelected={isOwner ? changeProfileImage : undefined}
              image={profileImage}
            />
          </div>
          <div className="user-header-info">
            <h1>{displayName}</h1>
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
