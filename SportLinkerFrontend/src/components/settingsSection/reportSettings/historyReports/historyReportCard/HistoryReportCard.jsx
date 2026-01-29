import "./historyReportCard.css";

const HistoryReportCard = ({ report }) => {
  return (
    <div className="history-report-card-wrapper">
      <div className="history-report-headline">
        <p>{report.type}</p>
      </div>
      <h3>{report.title}</h3>
      <p>{report.description}</p>
      <p className="report-date">"{report.date}</p>
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
