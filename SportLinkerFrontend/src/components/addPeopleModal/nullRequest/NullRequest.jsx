import "./nullRequest.css";

const NullRequest = ({ icon }) => {
  return (
    <div className="null-request-container">
      <div className="null-icon-bg">{icon}</div>
      <h3>Brak Zaproszeń</h3>
    </div>
  );
};

export default NullRequest;
