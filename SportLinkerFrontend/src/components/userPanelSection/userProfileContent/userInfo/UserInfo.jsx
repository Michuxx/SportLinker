import "./userInfo.css";
import UserHeader from "./userHeader/UserHeader";
import { useState } from "react";
import UserDetailed from "./userDetailed/UserDetailed";

const UserInfo = () => {
  const [userInfo, setUserInfo] = useState({
    name: "John Snow",
    email: "John@example.pl",
    created: "30.10.2025",
    location: "",
    favouriteSport: [],
    aboutMe: "",
    createdOffers: 0,
    joinedOffers: 0,
    invitations: 0,
  });

  const [isAboutMeEditing, setIsAboutMeEditing] = useState(false);
  const [isSportEditing, setIsSportEditing] = useState(false);

  const [editData, setEditData] = useState({
    favouriteSport: userInfo.favouriteSport,
    aboutMe: userInfo.aboutMe,
  });

  const cancelHandle = (setEditingFalse) => {
    setEditData({
      favouriteSport: userInfo.favouriteSport,
      aboutMe: userInfo.aboutMe,
    });
    setEditingFalse();
  };

  const handleChangeEditData = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveData = (setEditingFalse) => {
    setUserInfo((prev) => ({
      ...prev,
      ...editData,
    }));
    setEditingFalse();
  };

  return (
    <div className="user-info-wrapper">
      <UserHeader
        name={userInfo.name}
        creationDate={userInfo.created}
        location={userInfo.location}
      />
      <UserDetailed
        isAboutMeEditing={isAboutMeEditing}
        isSportEditing={isSportEditing}
        setIsAboutMeEditing={setIsAboutMeEditing}
        setIsSportEditing={setIsSportEditing}
        handleSaveData={handleSaveData}
        cancelHandle={cancelHandle}
        onChange={handleChangeEditData}
        aboutMe={userInfo.aboutMe}
        editData={editData}
        createdOffers={userInfo.createdOffers}
        joinedOffers={userInfo.joinedOffers}
        invitations={userInfo.invitations}
      />
    </div>
  );
};

export default UserInfo;
