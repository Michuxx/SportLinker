import "./userInfo.css";
import UserHeader from "./userHeader/UserHeader";
import { useState } from "react";
import UserDetailed from "./userDetailed/UserDetailed";
import UserStats from "./userStats/UserStats";

const UserInfo = () => {
  const [userInfo, seUserInfo] = useState({
    name: "John Snow",
    mail: "John@example.pl",
    created: "30.10.2025",
    location: null,
    favouriteSport: null,
    aboutMe: null,
    createdOffers: 0,
    joinedOffers: 0,
    invitations: 0,
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
      <UserStats
        createdOffers={userInfo.createdOffers}
        joinedOffers={userInfo.joinedOffers}
        invitations={userInfo.invitations}
      />
    </div>
  );
};

export default UserInfo;
