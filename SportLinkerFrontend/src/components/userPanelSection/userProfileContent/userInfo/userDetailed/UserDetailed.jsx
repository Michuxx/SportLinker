import "./userDetailed.css";
import UserDetailedCards from "./UserDetailedCards";
import UserOffers from "./userOffers/UserOffers";

const UserDetailed = ({
  sport,
  aboutMe,
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
  const favouriteSportText = `Ulubiony sport: ${sport ? sport : "brak"}`;

  const aboutText = aboutMe
    ? aboutMe
    : `Brak opisu. Kliknij "Edytuj", aby dodać informacje o sobie`;

  return (
    <div className="user-detailed-wrapper">
      <UserDetailedCards
        aboutText={aboutText}
        editData={editData}
        onChange={onChange}
        createdOffers={createdOffers}
        joinedOffers={joinedOffers}
        invitations={invitations}
        isAboutMeEditing={isAboutMeEditing}
        isSportEditing={isSportEditing}
        setIsAboutMeEditing={setIsAboutMeEditing}
        setIsSportMeEditing={setIsSportMeEditing}
        handleSaveData={handleSaveData}
        cancelHandle={cancelHandle}
      />
      <UserOffers />
    </div>
  );
};

export default UserDetailed;
