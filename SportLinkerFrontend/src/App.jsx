import { Route, Routes } from "react-router";
import Home from "./components/Pages/Home";
import Profile from "./components/Pages/Profile";
import UserOffers from "./components/userPanelSection/userProfileContent/userOffers/UserOffers";
import UserInfo from "./components/userPanelSection/userProfileContent/userInfo/UserInfo";
import ForeignInvitations from "./components/userPanelSection/userProfileContent/foreignInvitations/ForeignInvitations";
import OfferStatuses from "./components/userPanelSection/userProfileContent/offerStatuses/OfferStatuses";

function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="profile" element={<Profile />}>
        <Route index element={<UserInfo />} />
        <Route path="userInfo" element={<UserInfo />} />
        <Route path="userOffers" element={<UserOffers />} />
        <Route path="foreignInvitations" element={<ForeignInvitations />} />
        <Route path="OfferStatuses" element={<OfferStatuses />} />
      </Route>
    </Routes>
  );
}

export default App;
1;
