import "./userInfo.css";
import UserHeader from "./userHeader/UserHeader";
import { useState } from "react";
import UserDetailed from "./userDetailed/UserDetailed";

const UserInfo = () => {
  const [userInfo, setUserInfo] = useState({
    userName: "Admin",
    email: "test@wp.pl",
    birthDate: null,
    gender: "male",
    aboutMe: null,
    profileImage: null,
    backgroundImage: null,
    createdOffers: 0,
    joinedOffers: 0,
    invitations: 0,
    long: null,
    lat: null,
    city: null,
    country: null,
    state: null,
    name: null,
    displayLabel: ", ",
    favouriteSports: [],
  });

  const [isAboutMeEditing, setIsAboutMeEditing] = useState(false);
  const [isSportEditing, setIsSportEditing] = useState(false);

  const [editData, setEditData] = useState({
    favouriteSports: userInfo.favouriteSports || [],
    aboutMe: userInfo.aboutMe || "",
  });

  const [errors, setErrors] = useState({
    aboutMe: "",
  });

  const cancelHandle = (setEditingFalse) => {
    setEditData({
      favouriteSports: userInfo.favouriteSports || [],
      aboutMe: userInfo.aboutMe || "",
    });
    setErrors((prev) => ({ ...prev, aboutMe: "" }));
    setEditingFalse();
  };

  const handleChangeEditData = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
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
    if (editData.aboutMe && editData.aboutMe.length > 180) {
      setErrors((prev) => ({
        ...prev,
        aboutMe: "Opis nie może przekraczać 180 znaków",
      }));
      return;
    }

    setUserInfo((prev) => ({
      ...prev,
      ...editData,
    }));
    setEditingFalse();
  };

  const locationData = {
    long: userInfo.long,
    lat: userInfo.lat,
    city: userInfo.city,
    country: userInfo.country,
    state: userInfo.state,
    name: userInfo.name,
    displayLabel: userInfo.displayLabel,
  };

  return (
    <div className="user-info-wrapper">
      <UserHeader
        userName={userInfo.userName}
        name={userInfo.userName}
        birthDate={userInfo.birthDate}
        location={locationData}
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
        location={locationData}
        errors={errors}
      />
    </div>
  );
};

export default UserInfo;
