import "./userStats.css";
import UserStatsCard from "./UserStatsCard";

const UserStats = ({ createdOffers, joinedOffers, invitations }) => {
  return (
    <div className="user-stats-wrapper">
      <h3>Statystyki</h3>
      <div className="user-stats-card-wrapper">
        <UserStatsCard value={createdOffers} text="Utworzone oferty" />
        <UserStatsCard value={joinedOffers} text="Dołączenia" />
        <UserStatsCard value={invitations} text="Zaproszenia" />
      </div>
    </div>
  );
};

export default UserStats;
