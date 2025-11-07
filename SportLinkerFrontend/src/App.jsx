import { Route, Routes } from "react-router";
import Home from "./components/Pages/Home";
import Profile from "./components/Pages/Profile";
import UserOffers from "./components/userPanelSection/userProfileContent/userOffers/UserOffers";
import UserInfo from "./components/userPanelSection/userProfileContent/userInfo/UserInfo";
import MyInvitations from "./components/userPanelSection/userProfileContent/myInvitations/MyInvitations";
import ForeignInvitations from "./components/userPanelSection/userProfileContent/foreignInvitations/ForeignInvitations";
import JoinedOffers from "./components/userPanelSection/userProfileContent/joinedOffers/JoinedOffers";

function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="profile" element={<Profile />}>
        <Route index element={<UserInfo />} />
        <Route path="userInfo" element={<UserInfo />} />
        <Route path="userOffers" element={<UserOffers />} />
        <Route path="myInvitations" element={<MyInvitations />} />
        <Route path="foreignInvitations" element={<ForeignInvitations />} />
        <Route path="joinedOffers" element={<JoinedOffers />} />
      </Route>
    </Routes>
  );
}

export default App;
1;
