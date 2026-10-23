import "./userInfo.css";
import UserHeader from "./userHeader/UserHeader";
import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router";
import UserDetailed from "./userDetailed/UserDetailed";
import useAuth from "../../../../hooks/useAuth";
import userService from "../../../../api/userService";
import { useToast } from "../../../../context/ToastContext";

const normalizeFavouriteSports = (sports, referenceSports = []) => {
  if (!Array.isArray(sports)) return [];
  return sports.map((sport) => {
    if (typeof sport === "object" && sport !== null) {
      return {
        id: sport.id,
        name: sport.name || sport.text || "",
      };
    }
    const sportId = Number(sport);
    const matched = referenceSports.find(
      (item) => typeof item === "object" && Number(item?.id) === sportId,
    );
    return {
      id: sportId,
      name: matched?.name || matched?.text || "",
    };
  });
};

const UserInfo = ({ userId: propUserId }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();

  const activeUserId =
    id || propUserId || searchParams.get("userId") || user?.id;

  const isOwner = Boolean(
    user?.id && String(user.id) === String(activeUserId),
  );

  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAboutMeEditing, setIsAboutMeEditing] = useState(false);
  const [isSportEditing, setIsSportEditing] = useState(false);
  const [isAboutMeSaving, setIsAboutMeSaving] = useState(false);
  const [isSportSaving, setIsSportSaving] = useState(false);

  const [editData, setEditData] = useState({
    favouriteSports: [],
    aboutMe: "",
  });

  const [errors, setErrors] = useState({
    aboutMe: "",
  });

  const fetchUserData = useCallback(async () => {
    if (!activeUserId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await userService.getUserData(activeUserId);
      const normalizedSports = normalizeFavouriteSports(data.favouriteSports);
      setUserInfo({
        ...data,
        favouriteSports: normalizedSports,
      });
      setEditData({
        favouriteSports: normalizedSports,
        aboutMe: data.aboutMe || "",
      });
    } catch (err) {
      const responseData = err.response?.data;
      const errorObj = responseData?.message;
      const errorCode =
        (typeof errorObj === "object" ? errorObj?.code : null) ||
        responseData?.code;
      const errorMsg =
        (typeof errorObj === "object" ? errorObj?.message : null) ||
        (typeof errorObj === "string" ? errorObj : null) ||
        responseData?.message ||
        "Nie udało się pobrać danych użytkownika.";

      if (errorCode === "USER_NOT_FOUND") {
        navigate("/user-not-found", {
          replace: true,
          state: {
            code: errorCode,
            message: errorMsg,
            searchedId: activeUserId,
          },
        });
        return;
      }

      setError(
        typeof errorMsg === "string"
          ? errorMsg
          : "Wystąpił błąd podczas pobierania danych profilu.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [activeUserId, navigate]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const cancelHandle = (setEditingFalse) => {
    if (userInfo) {
      setEditData({
        favouriteSports: userInfo.favouriteSports || [],
        aboutMe: userInfo.aboutMe || "",
      });
    }
    setErrors((prev) => ({ ...prev, aboutMe: "" }));
    setEditingFalse();
  };

  const handleChangeEditData = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleChangeProfileImage = async (file) => {
    if (!isOwner || !file) return;
    try {
      const data = await userService.updateImage("Profile", file);
      setUserInfo((prev) => ({
        ...prev,
        profileImage: data.imageUrl,
      }));
      showToast({
        severity: "success",
        summary: "Zdjęcie profilowe",
        detail: "Zdjęcie profilowe zostało zaktualizowane.",
        life: 3000,
      });
    } catch (err) {
      console.error("Błąd podczas przesyłania zdjęcia profilowego:", err);
      showToast({
        severity: "error",
        summary: "Błąd",
        detail: "Nie udało się przesłać zdjęcia profilowego.",
        life: 3500,
      });
    }
  };

  const handleChangeBackgroundImage = async (file) => {
    if (!isOwner || !file) return;
    try {
      const data = await userService.updateImage(
        "Background",
        file,
      );
      setUserInfo((prev) => ({
        ...prev,
        backgroundImage: data.imageUrl,
      }));
      showToast({
        severity: "success",
        summary: "Zdjęcie w tle",
        detail: "Zdjęcie w tle zostało zaktualizowane.",
        life: 3000,
      });
    } catch (err) {
      console.error("Błąd podczas przesyłania zdjęcia w tle:", err);
      showToast({
        severity: "error",
        summary: "Błąd",
        detail: "Nie udało się przesłać zdjęcia w tle.",
        life: 3500,
      });
    }
  };

  const handleSaveData = async (setEditingFalse, fieldType) => {
    if (!isOwner) return;

    if (!fieldType || fieldType === "aboutMe") {
      if (editData.aboutMe && editData.aboutMe.length > 180) {
        setErrors((prev) => ({
          ...prev,
          aboutMe: "Opis nie może przekraczać 180 znaków",
        }));
        return;
      }

      setIsAboutMeSaving(true);
      try {
        const result = await userService.updateAboutMe(
          editData.aboutMe,
        );
        const updatedAboutMe =
          result?.aboutMe !== undefined ? result.aboutMe : editData.aboutMe;

        setUserInfo((prev) => ({
          ...prev,
          aboutMe: updatedAboutMe,
        }));
        setEditData((prev) => ({
          ...prev,
          aboutMe: updatedAboutMe || "",
        }));
        setEditingFalse();
        showToast({
          severity: "success",
          summary: "Sukces",
          detail: "Opis został pomyślnie zapisany.",
          life: 3000,
        });
      } catch (err) {
        const errMsg =
          err.response?.data?.message?.message ||
          err.response?.data?.message ||
          "Nie udało się zapisać opisu.";
        setErrors((prev) => ({
          ...prev,
          aboutMe:
            typeof errMsg === "string"
              ? errMsg
              : "Nie udało się zapisać opisu.",
        }));
        showToast({
          severity: "error",
          summary: "Błąd",
          detail:
            typeof errMsg === "string"
              ? errMsg
              : "Nie udało się zapisać opisu.",
          life: 3500,
        });
      } finally {
        setIsAboutMeSaving(false);
      }
      return;
    }

    if (fieldType === "favouriteSports") {
      setIsSportSaving(true);
      try {
        const sportIds = (editData.favouriteSports || [])
          .map((s) => (typeof s === "object" ? s.id : Number(s)))
          .filter(Boolean);

        const updatedIds = await userService.updateFavouriteSports(
          sportIds,
        );
        const normalizedSports = normalizeFavouriteSports(
          Array.isArray(updatedIds) ? updatedIds : editData.favouriteSports,
          editData.favouriteSports,
        );

        setUserInfo((prev) => ({
          ...prev,
          favouriteSports: normalizedSports,
        }));
        setEditData((prev) => ({
          ...prev,
          favouriteSports: normalizedSports,
        }));
        setEditingFalse();
        showToast({
          severity: "success",
          summary: "Sukces",
          detail: "Ulubione sporty zostały pomyślnie zapisane.",
          life: 3000,
        });
      } catch (err) {
        console.error("Błąd podczas aktualizacji ulubionych sportów:", err);
        showToast({
          severity: "error",
          summary: "Błąd",
          detail: "Nie udało się zaktualizować ulubionych sportów.",
          life: 3500,
        });
      } finally {
        setIsSportSaving(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="user-info-wrapper user-info-loading">
        <div className="user-info-spinner" />
        <p>Ładowanie danych profilu...</p>
      </div>
    );
  }

  if (error && !userInfo) {
    return (
      <div className="user-info-wrapper user-info-error">
        <p>{error}</p>
        <button className="user-info-retry-btn" onClick={fetchUserData}>
          Spróbuj ponownie
        </button>
      </div>
    );
  }

  if (!userInfo) {
    return null;
  }

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
        changeProfileImage={isOwner ? handleChangeProfileImage : undefined}
        backgroundImage={userInfo.backgroundImage}
        changeBackgroundImage={
          isOwner ? handleChangeBackgroundImage : undefined
        }
        isOwner={isOwner}
      />
      <UserDetailed
        isAboutMeEditing={isAboutMeEditing}
        isSportEditing={isSportEditing}
        setIsAboutMeEditing={setIsAboutMeEditing}
        setIsSportEditing={setIsSportEditing}
        isAboutMeSaving={isAboutMeSaving}
        isSportSaving={isSportSaving}
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
        isOwner={isOwner}
      />
    </div>
  );
};

export default UserInfo;
