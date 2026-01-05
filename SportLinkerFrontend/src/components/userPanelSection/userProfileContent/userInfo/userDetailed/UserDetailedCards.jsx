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
}) => {
  return (
    <div className="user-detailed-cards-wrapper">
      <UserDetailedBackground title="O mnie">
        <UserDetailedDescription
          text={aboutText}
          editData={editData}
          name="aboutMe"
          onChange={onChange}
          placeholder="Napisz coś o sobie :)"
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
