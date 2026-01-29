import "./historyReportCard.css";
import useDateFormat from "../../../../../hooks/useDateFormat";
import ReportTag from "../../../../component-items/tags/ReportTag";

const HistoryReportCard = ({ report }) => {
  const reportType = {
    inappropriateContent: "Nieodpowiednia treść",
    spam: "Spam",
    fakeProfile: "Fałszywy profil",
    harassment: "Nękanie",
    other: "Inne",
  };

  const reportText = reportType[report.type];

  const normalizedDate = useDateFormat(report.date);

  return (
    <div className="history-report-card-wrapper">
      <div className="history-report-headline">
        <p>{reportText}</p>
        <ReportTag styleType={report.status} />
      </div>
      <h4>{report.title}</h4>
      <p className="report-description">{report.description}</p>
      <p className="report-date">
        Zgłoszono: {normalizedDate.date} o {normalizedDate.time}
      </p>
      {report.response && (
        <div className="history-report-response">
          <span>Odpowiedź administracji:</span>
          <p>{report.response}</p>
        </div>
      )}
    </div>
  );
};

export default HistoryReportCard;
