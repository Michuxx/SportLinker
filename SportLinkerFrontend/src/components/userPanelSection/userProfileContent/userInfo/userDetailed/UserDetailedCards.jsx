import MapView from "../../../../component-items/mapView/MapView";
import "./userDetailed.css";
import UserDetailedBackground from "./UserDetailedBackground";
import UserDetailedDescription from "./userDetailedDescription";
import UserDetailedSport from "./UserDetailedSport";
import UserStatsCard from "./userStats/UserStatsCard";

const UserDetailedCards = ({
  aboutText,
  editData,
  onChange,
  createdOffers,
  joinedOffers,
  invitations,
  isAboutMeEditing,
  setIsAboutMeEditing,
  isSportEditing,
  setIsSportEditing,
  cancelHandle,
  handleSaveData,
  location,
  errors,
}) => {
  const handleCancelAboutMe = () => {
    cancelHandle(() => setIsAboutMeEditing(false));
  };

  const handleSaveAboutMe = () => {
    handleSaveData(() => setIsAboutMeEditing(false));
  };

  const handleCancelSport = () => {
    cancelHandle(() => setIsSportEditing(false));
  };

  const handleSaveSport = () => {
    handleSaveData(() => setIsSportEditing(false));
  };

  return (
    <div className="user-detailed-cards-wrapper">
      <UserDetailedBackground
        title="O mnie"
        isEditing={isAboutMeEditing}
        setEditing={() => setIsAboutMeEditing(true)}
        cancelEdit={handleCancelAboutMe}
        saveEdit={handleSaveAboutMe}
      >
        <UserDetailedDescription
          text={aboutText}
          editData={editData}
          name="aboutMe"
          onChange={onChange}
          placeholder="Napisz coś o sobie :)"
          isEditing={isAboutMeEditing}
          maxLetters={180}
          error={errors.aboutMe}
        />
      </UserDetailedBackground>
      <UserDetailedBackground
        title="Ulubione sporty"
        isEditing={isSportEditing}
        setEditing={() => setIsSportEditing(true)}
        cancelEdit={handleCancelSport}
        saveEdit={handleSaveSport}
      >
        <UserDetailedSport
          isEditing={isSportEditing}
          selectedSports={editData.favouriteSport}
          onChange={onChange}
        />
      </UserDetailedBackground>
      <UserDetailedBackground title="Statystyki">
        <UserStatsCard
          value={createdOffers}
          text="Utworzone oferty"
          bgColor="rgb(239 246 255)"
          textColor="rgb(37 99 235)"
        />
        <UserStatsCard
          value={joinedOffers}
          text="Dołączenia"
          bgColor="rgb(238 242 255)"
          textColor="rgb(79 70 229)"
        />
        <UserStatsCard
          value={invitations}
          text="Zaproszenia"
          bgColor="rgb(250 245 255)"
          textColor="rgb(147 51 234)"
        />
      </UserDetailedBackground>
      <UserDetailedBackground title="Mapa">
        <MapView
          lat={location.lat}
          long={location.long}
          markerText={location.displayLabel}
          mapHeight="350px"
          initialZoomMap={12}
        />
      </UserDetailedBackground>
    </div>
  );
};

export default UserDetailedCards;
