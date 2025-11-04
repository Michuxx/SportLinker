import "./userInfo.css";
import UserHeader from "./userHeader/UserHeader";
import { useState } from "react";
import UserDetailed from "./userDetailed/UserDetailed";
import UserStats from "./userStats/UserStats";

const UserInfo = () => {
  const [userInfo, setUserInfo] = useState({
    name: "John Snow",
    email: "John@example.pl",
    created: "30.10.2025",
    location: "",
    favouriteSport: null,
    aboutMe: "",
    createdOffers: 0,
    joinedOffers: 0,
    invitations: 0,
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
  });

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const [isEditing, setIsEditing] = useState(false);

  const [editData, setEditData] = useState({
    name: userInfo.name,
    email: userInfo.email,
    location: userInfo.location,
    favouriteSport: userInfo.favouriteSport,
    aboutMe: userInfo.aboutMe,
  });

  const cancelHandle = () => {
    setEditData({
      name: userInfo.name,
      email: userInfo.email,
      location: userInfo.location,
      favouriteSport: userInfo.favouriteSport,
      aboutMe: userInfo.aboutMe,
    });
    setIsEditing(false);
    setErrors({
      name: "",
      email: "",
    });
  };

  const emailValidation = () => {
    if (editData.email.length === 0 || !emailRegex.test(editData.email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Email jest nieprawidłowy lub pusty",
      }));
      return false;
    }
    return true;
  };

  const nameValidation = () => {
    if (editData.name.length === 0) {
      setErrors((prev) => ({
        ...prev,
        name: "Imię i nazwisko nie może być puste",
      }));
      return false;
    }
    return true;
  };

  const handleChangeEditData = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSaveData = () => {
    const validatedEmail = emailValidation();
    const validatedName = nameValidation();

    if (validatedEmail && validatedName) {
      setUserInfo((prev) => ({
        ...prev,
        ...editData,
      }));
      setIsEditing(false);
    }
  };

  return (
    <div className="user-info-wrapper">
      <UserHeader
        name={userInfo.name}
        email={userInfo.email}
        editData={editData}
        isEditing={isEditing}
        onChange={handleChangeEditData}
        setIsEditing={() => setIsEditing((e) => !e)}
        cancelHandle={cancelHandle}
        handleSave={handleSaveData}
        error={errors}
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
