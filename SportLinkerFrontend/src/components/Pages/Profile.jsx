import Header from "../headerSection/Header";
import "../../index.css";
import UserPanelSection from "../userPanelSection/UserPanelSection";
const Profile = () => {
  return (
    <div className="profile-container">
      <Header />
      <UserPanelSection />
    </div>
  );
};

export default Profile;
