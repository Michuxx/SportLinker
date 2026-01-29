import HistoryReportCard from "./historyReportCard/HistoryReportCard";
import "./historyReports.css";
import NullComponent from "../../../component-items/nullComponent/NullComponent";
import { TbFlagExclamation } from "react-icons/tb";

const HistoryReports = ({ historyReports }) => {
  return (
    <div className="history-report-wrapper">
      {historyReports && historyReports.length > 0 ? (
        historyReports.map((report) => (
          <HistoryReportCard report={report} key={report.id} />
        ))
      ) : (
        <NullComponent
          icon={<TbFlagExclamation size={32} color="red" />}
          title="Brak zgłoszeń"
        />
      )}
    </div>
  );
};

export default HistoryReports;
