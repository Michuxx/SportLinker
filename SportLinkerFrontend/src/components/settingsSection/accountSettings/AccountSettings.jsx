import { useState, useEffect, useCallback } from "react";
import UserDetailedBackground from "../../userPanelSection/userProfileContent/userInfo/userDetailed/UserDetailedBackground";
import "./accountSettings.css";
import PersonalInfo from "./personalInfo/PersonalInfo";
import SecurityPanel from "./securityPanel/SecurityPanel";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { MdOutlineContactPhone } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaRegTrashAlt } from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";
import userService from "../../../api/userService";
import { setStoredUser } from "../../../utils/tokenStorage";
import { useToast } from "../../../context/ToastContext";

const AccountSettings = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    birthDate: "",
    location: null,
    gender: "NotDisclosed",
  });

  const [searchLocation, setSearchLocation] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [errors, setErrors] = useState({
    name: "",
    birthDate: "",
  });

  const fetchCurrentUserData = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const data = await userService.getUserData(user.id);
      const hasValidCoords = data.lat != null && data.long != null;
      const locObj = hasValidCoords
        ? {
            long: data.long,
            lat: data.lat,
            country: data.country || null,
            name: data.name || data.city || null,
            state: data.state || null,
            displayLabel: data.displayLabel || null,
          }
        : null;

      const cleanLabel =
        data.displayLabel &&
        data.displayLabel.trim() !== "," &&
        data.displayLabel.trim() !== ", "
          ? data.displayLabel
          : [data.name || data.city, data.state].filter(Boolean).join(", ");

      setUserInfo({
        name: data.userName || "",
        email: data.email || "",
        phoneNumber: data.phoneNumber || "",
        birthDate: data.birthDate || "",
        location: locObj,
        gender: data.gender ? data.gender.toLowerCase() : "NotDisclosed",
      });

      setSearchLocation(cleanLabel || "");
    } catch (err) {
      console.error("Błąd podczas pobierania danych konta:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchCurrentUserData();
  }, [fetchCurrentUserData]);

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
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleChangeLocation = (value) => {
    setUserInfo((prev) => ({ ...prev, location: value }));
  };

  const handleSaveData = async () => {
    if (!user?.id || isSaving) return;

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

    // --- 1. NAME ---
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

    if (!isValid) return;

    const locationToSend =
      searchLocation?.trim() &&
      userInfo.location &&
      userInfo.location.lat != null &&
      userInfo.location.long != null
        ? {
            long: Number(userInfo.location.long),
            lat: Number(userInfo.location.lat),
            country: userInfo.location.country || null,
            name: userInfo.location.name || userInfo.location.city || null,
            state: userInfo.location.state || null,
            displayLabel:
              userInfo.location.displayLabel || searchLocation.trim(),
          }
        : null;

    setIsSaving(true);
    try {
      const updated = await userService.updateProfile({
        userId: Number(user.id),
        name: userInfo.name.trim(),
        birthDate: userInfo.birthDate || null,
        gender: userInfo.gender,
        location: locationToSend,
      });

      setUserInfo((prev) => ({
        ...prev,
        name: updated.name ?? prev.name.trim(),
        birthDate: updated.birthDate ?? prev.birthDate,
        gender: updated.gender ? updated.gender.toLowerCase() : "NotDisclosed",
        location: updated.location ?? locationToSend,
      }));

      if (updated.location?.displayLabel) {
        setSearchLocation(updated.location.displayLabel);
      } else if (!locationToSend) {
        setSearchLocation("");
      }

      setStoredUser({ name: updated.name ?? userInfo.name.trim() });

      showToast({
        severity: "success",
        summary: "Sukces",
        detail: "Dane profilowe zostały pomyślnie zapisane.",
        life: 3000,
      });
    } catch (err) {
      const errMsg =
        err.response?.data?.message?.message ||
        err.response?.data?.message ||
        "Wystąpił błąd podczas zapisywania zmian.";
      showToast({
        severity: "error",
        summary: "Błąd",
        detail:
          typeof errMsg === "string"
            ? errMsg
            : "Wystąpił błąd podczas zapisywania zmian.",
        life: 4000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="acc-settings-wrapper">
      <UserDetailedBackground
        title="Informacje podstawowe"
        saveEdited={handleSaveData}
        isSaving={isSaving}
      >
        {isLoading ? (
          <div className="acc-settings-loading">Ładowanie danych konta...</div>
        ) : (
          <PersonalInfo
            userInfo={userInfo}
            errors={errors}
            handleChange={handleChange}
            handleChangeLocation={handleChangeLocation}
            setSearchLocation={setSearchLocation}
            searchLocation={searchLocation}
          />
        )}
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
