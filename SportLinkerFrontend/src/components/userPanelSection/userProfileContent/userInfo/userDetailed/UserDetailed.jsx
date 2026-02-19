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
  errors,
}) => {
  const aboutText = aboutMe || `Brak opisu`;

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
        errors={errors}
      />
      <UserOffers />
    </div>
  );
};

export default UserDetailed;
