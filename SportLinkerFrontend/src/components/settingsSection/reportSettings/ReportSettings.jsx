import { useState } from "react";
import "./reportSettings.css";
import ReportForm from "./reportForm/ReportForm";
import UserDetailedBackground from "../../userPanelSection/userProfileContent/userInfo/userDetailed/UserDetailedBackground";

const ReportSettings = () => {
  const [reportForm, setReportForm] = useState({
    type: "none",
    title: "",
    description: "",
  });

  const [errors, setErrors] = useState({
    type: "",
    title: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReportForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = () => {
    const newErrors = {};
    let isValid = true;

    // --- 1. type ---
    if (reportForm.type === "none") {
      newErrors.type = "Wybierz typ zgłoszenia";
      isValid = false;
    }

    // --- 2. title ---
    if (!reportForm.title.trim()) {
      newErrors.title = "Tytuł nie może być pusty";
      isValid = false;
    } else if (reportForm.title.length > 50) {
      newErrors.title = "Tytuł zgłoszenia nie może mieć więcej niż 50 znaków";
      isValid = false;
    }

    // --- 3. description ---
    if (reportForm.description.length > 400) {
      newErrors.description = "Opis nie może mieć więcej niż 400 znaków";
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      console.log("Stworzono!");
    }
  };

  return (
    <div className="report-settings-wrapper">
      <UserDetailedBackground title="Nowe zgłoszenie">
        <ReportForm
          reportForm={reportForm}
          errors={errors}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </UserDetailedBackground>
    </div>
  );
};

export default ReportSettings;
