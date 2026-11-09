const MessagingFeedback = ({ loading = false, onRetry }) => (
  <div className="messaging-feedback" role={loading ? "status" : "alert"}>
    <p>{loading ? "Ładowanie..." : "Nie udało się pobrać danych."}</p>
    {!loading && <button type="button" className="chat-load-older" onClick={onRetry}>Spróbuj ponownie</button>}
  </div>
);
export default MessagingFeedback;
