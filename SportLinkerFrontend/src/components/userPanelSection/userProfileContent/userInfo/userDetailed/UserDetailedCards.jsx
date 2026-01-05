import "./userDetailed.css";
import UserDetailedBackground from "./UserDetailedBackground";
import UserDetailedDescription from "./userDetailedDescription";
import UserDetailedSport from "./UserDetailedSport";
import UserStatsCard from "./userStats/UserStatsCard";

const UserDetailedCards = ({
  aboutText,
  favouriteSportText,
  editData,
  onChange,
  createdOffers,
  joinedOffers,
  invitations,
  isSportEditing,
  isAboutMeEditing,
  setIsSportMeEditing,
  setIsAboutMeEditing,
  cancelHandle,
  handleSaveData,
}) => {
  const handleCancelAboutMe = () => {
    cancelHandle(() => setIsAboutMeEditing(false));
  };

  const handleSaveAboutMe = () => {
    handleSaveData(() => setIsAboutMeEditing(false));
  };

  return (
    <div className="user-detailed-cards-wrapper">
      <UserDetailedBackground
        title="O mnie"
        setEditing={() => setIsAboutMeEditing(true)}
        isEditing={isAboutMeEditing}
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
        />
      </UserDetailedBackground>
      <UserDetailedBackground title="Ulubione sporty">
        {favouriteSportText}
        <UserDetailedSport
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
    </div>
  );
};

export default UserDetailedCards;
