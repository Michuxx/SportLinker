import "./userInfo.css";
import UserHeader from "./userHeader/UserHeader";
import { useState } from "react";
import UserDetailed from "./userDetailed/UserDetailed";

const UserInfo = () => {
  const [userInfo, setUserInfo] = useState({
    name: "John Snow",
    email: "John@example.pl",
    birthDate: "2003-01-20",
    gender: {
      value: "Male",
      text: "Mężczyzna",
    },
    location: "",
    favouriteSport: [],
    aboutMe: "",
    profileImage: null,
    backgroundImage: null,
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

  const handleChangeProfileImage = (image) => {
    setUserInfo((prev) => ({
      ...prev,
      profileImage: image,
    }));
  };

  const handleChangeBackgroundImage = (image) => {
    setUserInfo((prev) => ({
      ...prev,
      backgroundImage: image,
    }));
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
        birthDate={userInfo.birthDate}
        location={userInfo.location}
        gender={userInfo.gender}
        profileImage={userInfo.profileImage}
        changeProfileImage={handleChangeProfileImage}
        backgroundImage={userInfo.backgroundImage}
        changeBackgroundImage={handleChangeBackgroundImage}
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
