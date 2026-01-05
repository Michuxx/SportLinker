import "./userDetailed.css";
import UserDetailedBackground from "./UserDetailedBackground";
import UserDetailedDescription from "./userDetailedDescription";
import UserStatsCard from "./userStats/UserStatsCard";

const UserDetailedCards = ({
  aboutText,
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
      <UserDetailedBackground title="Ulubione sporty"></UserDetailedBackground>
      <UserDetailedBackground title="Statystyki">
        <UserStatsCard value={createdOffers} text="Utworzone oferty" />
        <UserStatsCard value={joinedOffers} text="Dołączenia" />
        <UserStatsCard value={invitations} text="Zaproszenia" />
      </UserDetailedBackground>
    </div>
  );
};

export default UserDetailedCards;
