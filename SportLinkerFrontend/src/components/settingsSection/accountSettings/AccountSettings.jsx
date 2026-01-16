import { useState } from "react";
import UserDetailedBackground from "../../userPanelSection/userProfileContent/userInfo/userDetailed/UserDetailedBackground";
import InputField from "../../component-items/inputField/InputField";
import Input from "../../component-items/input/Input";
import Select from "../../component-items/select/Select";
import "./accountSettings.css";
import { GENDERS } from "../../../assets/GENDERS";
import { GrLocation } from "react-icons/gr";
import { FiCalendar } from "react-icons/fi";
import { MdMailOutline } from "react-icons/md";
import { LuUser } from "react-icons/lu";
import { FiPhone } from "react-icons/fi";
import { FaTransgender } from "react-icons/fa";

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
    if (userInfo.birthDate > todaysDate) {
      newErrors.birthDate = "Data urodzenia nie może być z przyszłości";
      isValid = false;
    } else if (userInfo.birthDate > tooYoungDate) {
      newErrors.birthDate = "Musisz mieć co najmniej 13 lat";
      isValid = false;
    } else if (userInfo.birthDate < tooOldDate) {
      newErrors.birthDate = "Wprowadzona data wskazuje na wiek powyżej 80 lat";
      isValid = false;
    }

    setErrors(newErrors);

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
        <div className="acc-settings-input-wrapper">
          <InputField label="Jan Kowalski">
            <Input
              placeholder="John Doe"
              type="text"
              width={100}
              icon={<LuUser color="rgb(156 163 175)" size="20px" />}
              onChange={(e) => handleChange(e)}
              value={userInfo.name}
              error={errors.name}
              name="name"
            />
          </InputField>
          <InputField label="Email">
            <Input
              placeholder="John@example.com"
              type="email"
              width={100}
              icon={<MdMailOutline color="rgb(156 163 175)" size="20px" />}
              onChange={(e) => handleChange(e)}
              value={userInfo.email}
              name="email"
              disabled={true}
            />
          </InputField>
        </div>
        <div className="acc-settings-input-wrapper">
          <InputField label="Numer telefonu">
            <Input
              icon={<FiPhone color="rgb(156 163 175)" size="20px" />}
              placeholder="+48 123 456 789"
              type="text"
              width={100}
              onChange={(e) => handleChange(e)}
              name="phoneNumber"
              value={userInfo.phoneNumber}
              disabled={true}
            />
          </InputField>
          <InputField label="Lokalizacja">
            <Input
              placeholder="np. Warszawa"
              type="text"
              icon={<GrLocation color="rgb(156, 163, 175)" size={20} />}
              width={100}
              onChange={(e) => handleChange(e)}
              name="location"
              value={userInfo.location}
            />
          </InputField>
        </div>
        <div className="acc-settings-input-wrapper">
          <InputField label="Data Urodzenia">
            <Input
              type="date"
              icon={<FiCalendar color="rgb(156, 163, 175)" size={20} />}
              width={100}
              onChange={(e) => handleChange(e)}
              name="birthDate"
              value={userInfo.birthDate}
              error={errors.birthDate}
            />
          </InputField>
          <InputField label="Płeć">
            <Select
              icon={<FaTransgender color="rgb(156, 163, 175)" size={20} />}
              width={100}
              options={GENDERS}
              defaultValue="NotDisclosed"
              defaultText="Wolę nie podawać"
              onChange={(e) => handleChange(e)}
              name="gender"
              value={userInfo.gender}
            />
          </InputField>
        </div>
      </UserDetailedBackground>
    </div>
  );
};

export default AccountSettings;
