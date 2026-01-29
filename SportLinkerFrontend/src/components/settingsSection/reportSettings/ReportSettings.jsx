import { useState } from "react";
import "./reportSettings.css";
import ReportForm from "./reportForm/ReportForm";
import UserDetailedBackground from "../../userPanelSection/userProfileContent/userInfo/userDetailed/UserDetailedBackground";

const ReportSettings = () => {
  return (
    <div className="report-settings-wrapper">
      <UserDetailedBackground title="Nowe zgłoszenie">
        <ReportForm />
      </UserDetailedBackground>
    </div>
  );
};

export default ReportSettings;
