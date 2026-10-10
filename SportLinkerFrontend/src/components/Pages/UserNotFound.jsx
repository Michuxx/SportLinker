import Header from "../headerSection/Header";
import "../../index.css";
import "./userNotFound.css";
import { LuUserX, LuUser } from "react-icons/lu";
import { FiHome } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";

const UserNotFound = ({
  message: propMessage,
  code: propCode,
  searchedId: propSearchedId,
  embed = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const code = propCode || location.state?.code || "USER_NOT_FOUND";
  const message =
    propMessage || location.state?.message || "Użytkownik nie istnieje.";
  const searchedId = propSearchedId || location.state?.searchedId;

  const cardContent = (
    <div className="user-not-found-card">
      <div className="user-not-found-icon-wrapper">
        <LuUserX size={48} />
      </div>

      <span className="user-not-found-badge">{code}</span>

      <h1 className="user-not-found-title">Nie znaleziono użytkownika</h1>

      <p className="user-not-found-message">{message}</p>

      <p className="user-not-found-description">
        {searchedId
          ? `Użytkownik o identyfikatorze #${searchedId} nie został odnaleziony w serwisie SportLinker.`
          : "Profil, którego szukasz, nie istnieje lub został usunięty z serwisu SportLinker."}
      </p>

      <div className="user-not-found-actions">
        <button
          className="user-not-found-btn primary"
          onClick={() => navigate("/")}
        >
          <FiHome size={18} />
          Strona główna
        </button>
        {user ? (
          <button
            className="user-not-found-btn secondary"
            onClick={() => navigate(`/profile/userInfo/${user?.id}`)}
          >
            <LuUser size={18} />
            Mój profil
          </button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );

  if (embed) {
    return <div className="user-not-found-content">{cardContent}</div>;
  }

  return (
    <div className="user-not-found-container">
      <Header />
      <div className="user-not-found-content">{cardContent}</div>
    </div>
  );
};

export default UserNotFound;
