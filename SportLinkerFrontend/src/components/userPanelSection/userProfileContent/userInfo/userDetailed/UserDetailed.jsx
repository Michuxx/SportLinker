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
  isAboutMeSaving = false,
  isSportSaving = false,
  cancelHandle,
  handleSaveData,
  location,
  errors,
  isOwner = false,
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
        isAboutMeSaving={isAboutMeSaving}
        isSportSaving={isSportSaving}
        handleSaveData={handleSaveData}
        cancelHandle={cancelHandle}
        location={location}
        errors={errors}
        isOwner={isOwner}
      />
      <UserOffers isOwner={isOwner} />
    </div>
  );
};

export default UserDetailed;
