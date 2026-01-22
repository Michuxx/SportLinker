import "./userDetailed.css";
import UserDetailedCards from "./UserDetailedCards";
import UserOffers from "./userOffers/UserOffers";

const UserDetailed = ({
  aboutMe,
  editData,
  onChange,
  createdOffers,
  joinedOffers,
  invitations,
  isSportEditing,
  setIsSportEditing,
  isAboutMeEditing,
  setIsAboutMeEditing,
  cancelHandle,
  handleSaveData,
  location,
}) => {
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
        setIsSportEditing={setIsSportEditing}
        handleSaveData={handleSaveData}
        cancelHandle={cancelHandle}
        location={location}
      />
      <UserOffers />
    </div>
  );
};

export default UserDetailed;
