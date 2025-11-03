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
    aboutMe: "",
    createdOffers: 0,
    joinedOffers: 0,
    invitations: 0,
  });

  const [isEditing, setIsEditing] = useState(false);

  const [editData, setEditData] = useState({
    name: "John Snow",
    mail: "John@example.pl",
    location: null,
    favouriteSport: null,
    aboutMe: "",
  });

  const cancelHandle = () => {
    setEditData({
      name: userInfo.name,
      mail: userInfo.mail,
      location: userInfo.location,
      favouriteSport: userInfo.favouriteSport,
      aboutMe: userInfo.aboutMe,
    });
    setIsEditing(false);
  };

  const handleChangeEditData = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="user-info-wrapper">
      <UserHeader
        name={userInfo.name}
        mail={userInfo.mail}
        editData={editData}
        isEditing={isEditing}
        onChange={handleChangeEditData}
        setIsEditing={() => setIsEditing((e) => !e)}
        cancelHandle={cancelHandle}
      />
      <UserDetailed
        onChange={handleChangeEditData}
        creationDate={userInfo.created}
        location={userInfo.location}
        sport={userInfo.favouriteSport}
        aboutMe={userInfo.aboutMe}
        editData={editData}
        isEditing={isEditing}
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
