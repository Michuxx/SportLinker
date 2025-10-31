import "./userInfo.css";
import UserHeader from "./UserHeader";
import { useState } from "react";
import UserDetailed from "./UserDetailed";

const UserInfo = () => {
  const [userInfo, seUserInfo] = useState({
    name: "John Snow",
    mail: "John@example.pl",
    created: "30.10.2025",
    location: null,
    favouriteSport: null,
    aboutMe: null,
  });

  return (
    <div className="user-info-wrapper">
      <UserHeader name={userInfo.name} mail={userInfo.mail} />
      <UserDetailed
        creationDate={userInfo.created}
        location={userInfo.location}
        sport={userInfo.favouriteSport}
        aboutMe={userInfo.aboutMe}
      />
    </div>
  );
};

export default UserInfo;
