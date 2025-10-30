import { Route, Routes } from "react-router";
import Home from "./components/Pages/Home";
import Profile from "./components/Pages/Profile";
import UserInvitations from "./components/userPanelSection/userProfileContent/Userinvitations";
import UserOffers from "./components/userPanelSection/userProfileContent/UserOffers";
import UserInfo from "./components/userPanelSection/userProfileContent/UserInfo";

function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="profile" element={<Profile />}>
        <Route index element={<UserInfo />} />
        <Route path="userInfo" element={<UserInfo />} />
        <Route path="userOffers" element={<UserOffers />} />
        <Route path="userInvitations" element={<UserInvitations />} />
      </Route>
    </Routes>
  );
}

export default App;
