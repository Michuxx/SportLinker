import Input from "../component-items/input/Input";
import InputField from "../component-items/inputField/InputField";
import Logo from "../component-items/logo/Logo";
import { MdMailOutline } from "react-icons/md";
import { GoLock } from "react-icons/go";
import "./login.css";
import Button from "../component-items/button/button";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";

const Login = ({ closeModal }) => {
  const { login, isLoading } = useAuth();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [generalError, setGeneralError] = useState("");

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setGeneralError("");
  };

  const emailValidation = () => {
    if (loginData.email.length === 0 || !emailRegex.test(loginData.email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Email jest nieprawidłowy",
      }));
      return false;
    }
    return true;
  };

  const passwordValidation = () => {
    if (loginData.password.length < 6) {
      setErrors((prev) => ({
        ...prev,
        password: "Hasło musi mieć co najmniej 6 znaków",
      }));
      return false;
    }
    return true;
  };

  const loginSubmit = async () => {
    setGeneralError("");
    const validatedEmail = emailValidation();
    const validatedPassword = passwordValidation();

    if (!validatedEmail || !validatedPassword) {
      return;
    }

    try {
      await login(loginData.email, loginData.password);
      if (closeModal) {
        closeModal();
      }
    } catch (err) {
      console.error("Błąd logowania:", err);
      const serverMsg =
        err.response?.data?.message ||
        err.response?.data?.title ||
        (typeof err.response?.data === "string" ? err.response?.data : null) ||
        (err.response?.status === 401
          ? "Nieprawidłowy adres email lub hasło."
          : "Nie udało się połączyć z serwerem. Sprawdź, czy backend działa.");
      setGeneralError(serverMsg);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-logo">
        <Logo />
      </div>
      <h2>Zaloguj się do SportLinker</h2>

      {generalError && <div className="auth-general-error">{generalError}</div>}

      <InputField label="Email">
        <Input
          placeholder="John@example.com"
          type="email"
          width={100}
          icon={<MdMailOutline color="rgb(156 163 175)" size="20px" />}
          onChange={(e) => handleChange(e)}
          value={loginData.email}
          error={errors.email}
          name="email"
          disabled={isLoading}
        />
      </InputField>
      <InputField label="Hasło">
        <Input
          placeholder="••••••••"
          type="password"
          width={100}
          icon={<GoLock color="rgb(156 163 175)" size="20px" />}
          onChange={(e) => handleChange(e)}
          value={loginData.password}
          error={errors.password}
          name="password"
          disabled={isLoading}
        />
      </InputField>
      <Button
        style="loginButton"
        width={100}
        onClick={loginSubmit}
        disabled={isLoading}
      >
        {isLoading ? "Logowanie..." : "Zaloguj się"}
      </Button>
    </div>
  );
};

export default Login;
