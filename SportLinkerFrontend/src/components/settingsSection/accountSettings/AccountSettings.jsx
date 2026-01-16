import { useState } from "react";
import UserDetailedBackground from "../../userPanelSection/userProfileContent/userInfo/userDetailed/UserDetailedBackground";
import "./accountSettings.css";
import PersonalInfo from "./PersonalInfo";

const AccountSettings = () => {
  const [userInfo, setUserInfo] = useState({
    name: "John Snow",
    email: "John@example.pl",
    phoneNumber: "",
    birthDate: "",
    location: "",
    gender: "NotDisclosed",
  });

  const [errors, setErrors] = useState({
    name: "",
    birthDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveData = () => {
    const newErrors = {};
    let isValid = true;

    const now = new Date();
    const todaysDate = now.toLocaleDateString("en-CA");

    const date13 = new Date();
    date13.setFullYear(now.getFullYear() - 13);
    const tooYoungDate = date13.toLocaleDateString("en-CA");

    const date80 = new Date();
    date80.setFullYear(now.getFullYear() - 80);
    const tooOldDate = date80.toLocaleDateString("en-CA");

    // --- 1.. NAME ---
    if (!userInfo.name.trim()) {
      newErrors.name = "Imię i nazwisko nie może być puste";
      isValid = false;
    } else if (userInfo.name.trim().length > 20) {
      newErrors.name = "Imię i nazwisko nie może mieć więcej niż 20 znaków";
      isValid = false;
    }

    // --- 2. BIRTH DATE ---
    if (userInfo.birthDate) {
      if (userInfo.birthDate > todaysDate) {
        newErrors.birthDate = "Data urodzenia nie może być z przyszłości";
        isValid = false;
      } else if (userInfo.birthDate > tooYoungDate) {
        newErrors.birthDate = "Musisz mieć co najmniej 13 lat";
        isValid = false;
      } else if (userInfo.birthDate < tooOldDate) {
        newErrors.birthDate =
          "Wprowadzona data wskazuje na wiek powyżej 80 lat";
        isValid = false;
      }
    }

    setErrors(newErrors);

    console.log(userInfo.birthDate);
    if (isValid) {
      console.log("zapisano");
    }
  };

  return (
    <div className="acc-settings-wrapper">
      <UserDetailedBackground
        title="Informacje podstawowe"
        saveEdited={handleSaveData}
      >
        <PersonalInfo
          userInfo={userInfo}
          errors={errors}
          handleChange={handleChange}
        />
      </UserDetailedBackground>
    </div>
  );
};

export default AccountSettings;
