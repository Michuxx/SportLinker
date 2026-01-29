import HistoryReportCard from "./historyReportCard/HistoryReportCard";
import "./historyReports.css";
import NullComponent from "../../../component-items/nullComponent/NullComponent";

const HistoryReports = ({ historyReports }) => {
  return (
    <div className="history-report-wrapper">
      {historyReports && historyReports.length > 0 ? (
        historyReports.map((report) => (
          <HistoryReportCard report={report} key={report.id} />
        ))
      ) : (
        <NullComponent />
      )}
    </div>
  );
};

export default HistoryReports;
