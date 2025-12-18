import "./userDetailed.css";
import UserDetailedBackground from "./UserDetailedBackground";
import UserDetailedDescription from "./userDetailedDescription";

const UserDetailedCards = ({ aboutText, isEditing, editData, onChange }) => {
  return (
    <div className="user-detailed-cards-wrapper">
      <UserDetailedBackground title="O mnie">
        <UserDetailedDescription
          text={aboutText}
          isEditing={isEditing}
          editData={editData}
          name="aboutMe"
          onChange={onChange}
          placeholder="Napisz coś o sobie :)"
        />
      </UserDetailedBackground>
      <UserDetailedBackground title="Ulubione sporty"></UserDetailedBackground>
      <UserDetailedBackground title="Statystyki"></UserDetailedBackground>
    </div>
  );
};

export default UserDetailedCards;
