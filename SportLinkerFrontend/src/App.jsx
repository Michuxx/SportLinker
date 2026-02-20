import { Route, Routes } from "react-router";
import Home from "./components/Pages/Home";
import Profile from "./components/Pages/Profile";
import UserInfo from "./components/userPanelSection/userProfileContent/userInfo/UserInfo";
import ForeignInvitations from "./components/userPanelSection/userProfileContent/foreignInvitations/ForeignInvitations";
import OfferStatuses from "./components/userPanelSection/userProfileContent/offerStatuses/OfferStatuses";
import Offer from "./components/Pages/Offer";
import Settings from "./components/Pages/Settings";
import AccountSettings from "./components/settingsSection/accountSettings/AccountSettings";
import ReportSettings from "./components/settingsSection/reportSettings/ReportSettings";
import Messages from "./components/Pages/Messages";

function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="profile" element={<Profile />}>
        <Route index element={<UserInfo />} />
        <Route path="userInfo" element={<UserInfo />} />
        <Route path="foreignInvitations" element={<ForeignInvitations />} />
        <Route path="offerStatuses" element={<OfferStatuses />} />
      </Route>
      <Route path="/offer/:id" element={<Offer />} />
      <Route path="settings" element={<Settings />}>
        <Route index element={<AccountSettings />} />
        <Route path="account" element={<AccountSettings />} />
        <Route path="reports" element={<ReportSettings />} />
      </Route>
      <Route path="messages" element={<Messages />} />
    </Routes>
  );
}

export default App;
1;
