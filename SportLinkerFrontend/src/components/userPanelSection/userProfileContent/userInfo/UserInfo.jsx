import "./userInfo.css";
import UserHeader from "./userHeader/UserHeader";
import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router";
import UserDetailed from "./userDetailed/UserDetailed";
import useAuth from "../../../../hooks/useAuth";
import userService from "../../../../api/userService";

const UserInfo = ({ userId: propUserId }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const activeUserId =
    id || propUserId || searchParams.get("userId") || user?.id;

  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAboutMeEditing, setIsAboutMeEditing] = useState(false);
  const [isSportEditing, setIsSportEditing] = useState(false);

  const [editData, setEditData] = useState({
    favouriteSports: [],
    aboutMe: "",
  });

  const [errors, setErrors] = useState({
    aboutMe: "",
  });

  const fetchUserData = useCallback(async () => {
    if (!activeUserId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await userService.getUserData(activeUserId);
      setUserInfo(data);
      setEditData({
        favouriteSports: data.favouriteSports || [],
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
  }, [activeUserId]);

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
