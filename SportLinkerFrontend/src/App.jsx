import { Route, Routes } from "react-router";
import Home from "./components/Pages/Home";
import Profile from "./components/Pages/Profile";
import UserInvitations from "./components/userPanelSection/userProfileContent/userInvitations/Userinvitations";
import UserOffers from "./components/userPanelSection/userProfileContent/userOffers/UserOffers";
import UserInfo from "./components/userPanelSection/userProfileContent/userInfo/UserInfo";

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
1;
