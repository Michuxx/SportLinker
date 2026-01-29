import { useState } from "react";
import "./reportSettings.css";
import ReportForm from "./reportForm/ReportForm";
import UserDetailedBackground from "../../userPanelSection/userProfileContent/userInfo/userDetailed/UserDetailedBackground";
import HistoryReports from "./historyReports/HistoryReports";

const ReportSettings = () => {
  const [reportForm, setReportForm] = useState({
    type: "none",
    title: "",
    description: "",
  });

  const [historyReports, setHistoryReports] = useState([
    // {
    //   id: 1,
    //   type: "inappropriateContent",
    //   status: "pending",
    //   title: "Nieodpowiednia treść w ofercie",
    //   description:
    //     "Użytkownik zamieścił nieodpowiednią treść w opisie oferty tenisowej.",
    //   date: "2027-01-20T18:00",
    //   response: null,
    // },
    // {
    //   id: 2,
    //   type: "spam",
    //   status: "solved",
    //   title: "Spam w wiadomościach",
    //   description: "Otrzymuję spam od użytkownika po dołączeniu do oferty.",
    //   date: "2027-01-20T18:00",
    //   response: "Sprawa została rozwiązana. Użytkownik otrzymał ostrzeżenie.",
    // },
    // {
    //   id: 3,
    //   type: "fakeProfile",
    //   status: "rejected",
    //   title: "Podejrzany profil użytkownika",
    //   description:
    //     "Profil wydaje się być fałszywy - brak zdjęcia, dziwne informacje.",
    //   date: "2027-01-20T18:00",
    //   response: "Po weryfikacji profil okazał się prawdziwy.",
    // },
  ]);

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
      const newReport = {
        ...reportForm,
        id: Date.now(), //  temporal
        status: "pending",
        date: new Date().toISOString(),
        response: null,
      };

      setHistoryReports((prev) => [newReport, ...prev]);
      setReportForm({
        type: "none",
        title: "",
        description: "",
      });
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
      <UserDetailedBackground title="Historia zgłoszeń">
        <HistoryReports historyReports={historyReports} />
      </UserDetailedBackground>
    </div>
  );
};

export default ReportSettings;
