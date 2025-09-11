import { useState } from "react";
import "./authModal.css";
import Login from "./Login";
import Register from "./Reigster";
import Button from "../component-items/button/button";

const AuthModal = () => {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <div className="auth-modal-wrapper">
      {isLogin ? <Login /> : <Register />}
      <div className="login-switcher">
        <Button style="loginSwitchButton" onClick={() => setIsLogin((e) => !e)}>
          {isLogin
            ? "Nie masz konta? Zarejestruj się"
            : "Masz już konto? Zaloguj się"}
        </Button>
      </div>
    </div>
  );
};

export default AuthModal;
