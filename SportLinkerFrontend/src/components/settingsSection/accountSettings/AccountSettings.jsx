import { useState } from "react";
import UserDetailedBackground from "../../userPanelSection/userProfileContent/userInfo/userDetailed/UserDetailedBackground";
import "./accountSettings.css";

const AccountSettings = () => {
  const [userInfo, setUserInfo] = useState({
    name: "John Snow",
    email: "John@example.pl",
    phone: "",
    birthDate: "",
    location: "",
    gender: "",
  });

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

  const handleSaveData = () => {
    setUserInfo((prev) => ({
      ...prev,
      ...editData,
    }));
  };

  return (
    <div className="acc-settings-wrapper">
      <UserDetailedBackground
        title="Informacje podstawowe"
        saveEdited={handleSaveData}
      ></UserDetailedBackground>
    </div>
  );
};

export default AccountSettings;
