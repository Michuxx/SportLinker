import { useState } from "react";
import UserDetailedBackground from "../../userPanelSection/userProfileContent/userInfo/userDetailed/UserDetailedBackground";
import "./accountSettings.css";
import PersonalInfo from "./personalInfo/PersonalInfo";
import SecurityPanel from "./securityPanel/SecurityPanel";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { MdOutlineContactPhone } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaRegTrashAlt } from "react-icons/fa";

const AccountSettings = () => {
  const [userInfo, setUserInfo] = useState({
    name: "John Snow",
    email: "John@example.pl",
    phoneNumber: "+48131675998",
    birthDate: "",
    location: {
      long: 19.028552141007275,
      lat: 50.25532955,
      country: "Poland",
      name: "Warsaw",
      state: "Masovian Voivodeship",
    },
    gender: "NotDisclosed",
  });

  const [searchLocation, setSearchLocation] = useState(
    userInfo.location && `${userInfo.location.name}, ${userInfo.location.state}`
  );

  const [errors, setErrors] = useState({
    name: "",
    birthDate: "",
  });

  const securityOptions = [
    {
      header: "Zmiana Emaila",
      text: "Twój obecny email jest nieaktualny? Zmień go klikając w przycisk",
      borderColor: "rgb(254 240 138)",
      bgColor: "rgb(254 252 232)",
      fontColor: "rgb(161 98 7)",
      buttonStyle: "classicOrangeButton",
      buttonText: "Zmień Email",
      buttonIcon: <MdOutlineAlternateEmail size={20} />,
    },
    {
      header: "Zmiana numeru telefonu",
      text: "Zmieniałeś numer telefonu? Zmień go klikając w przycisk",
      borderColor: "#D1E9FF",
      bgColor: "#EBF5FF",
      fontColor: "#1E40AF",
      buttonStyle: "classicBlueButton",
      buttonText: "Zmień numer telefonu",
      buttonIcon: <MdOutlineContactPhone size={20} />,
    },
    {
      header: "Zmiana Hasła",
      text: "Regularnie zmieniaj hasło, aby zachować bezpieczeństwo konta",
      borderColor: "#EDE9FE",
      bgColor: "#F5F3FF",
      fontColor: "#5B21B6",
      buttonStyle: "classicPurpleButton",
      buttonText: "Zmień hasło",
      buttonIcon: <RiLockPasswordLine size={20} />,
    },
    {
      header: "Usuń konto",
      text: "Usunięcie konta jest nieodwracalne. Wszystkie Twoje dane zostaną trwale usunięte.",
      borderColor: "rgb(254 202 202)",
      bgColor: "rgb(254 242 242)",
      fontColor: "rgb(185 28 28)",
      buttonStyle: "classicRedButton",
      buttonText: "Usuń konto",
      buttonIcon: <FaRegTrashAlt size={20} />,
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeLocation = (value) => {
    setUserInfo((prev) => ({ ...prev, location: value }));
    console.log(userInfo);
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
          handleChangeLocation={handleChangeLocation}
          setSearchLocation={setSearchLocation}
          searchLocation={searchLocation}
        />
      </UserDetailedBackground>
      <div className="acc-security-settings">
        <UserDetailedBackground title="Prywatność">
          <SecurityPanel options={securityOptions} />
        </UserDetailedBackground>
      </div>
    </div>
  );
};

export default AccountSettings;
