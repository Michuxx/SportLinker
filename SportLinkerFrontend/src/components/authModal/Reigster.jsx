import Button from "../component-items/button/button";
import Input from "../component-items/input/Input";
import InputField from "../component-items/inputField/InputField";
import Logo from "../component-items/logo/Logo";
import "./register.css";
import { MdMailOutline } from "react-icons/md";
import { GoLock } from "react-icons/go";
import { LuUser } from "react-icons/lu";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { getErrorCode, getErrorMessage } from "../../utils/apiErrorHelper";
import { USER_ERROR_CODES } from "../../constants/userErrors";

const Register = ({ closeModal, onRegisterSuccess }) => {
  const { register, login, isLoading } = useAuth();

  const [loginData, setLoginData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [generalError, setGeneralError] = useState("");
  const [generalSuccess, setGeneralSuccess] = useState("");

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

  const nameValidation = () => {
    if (loginData.name.trim().length === 0) {
      setErrors((prev) => ({
        ...prev,
        name: "Imię i nazwisko nie może być puste",
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

  const registerSubmit = async () => {
    setGeneralError("");
    setGeneralSuccess("");
    const validatedName = nameValidation();
    const validatedEmail = emailValidation();
    const validatedPassword = passwordValidation();

    if (!validatedEmail || !validatedPassword || !validatedName) {
      return;
    }

    try {
      await register({
        name: loginData.name,
        email: loginData.email,
        password: loginData.password,
      });

      // Po udanej rejestracji logujemy użytkownika automatycznie
      try {
        await login(loginData.email, loginData.password);
        if (closeModal) {
          closeModal();
        }
      } catch {
        // Jeśli automatyczne logowanie się nie powiedzie, przełączamy na ekran logowania
        setGeneralSuccess("Konto zostało utworzone! Możesz się teraz zalogować.");
        if (onRegisterSuccess) {
          setTimeout(() => onRegisterSuccess(), 1200);
        }
      }
    } catch (err) {
      console.error("Błąd rejestracji:", err);
      const errorCode = getErrorCode(err);
      const serverMsg = getErrorMessage(err);

      if (errorCode === USER_ERROR_CODES.EMAIL_ALREADY_IN_USE) {
        setErrors((prev) => ({ ...prev, email: serverMsg }));
      } else {
        setGeneralError(serverMsg);
      }
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-logo">
        <Logo />
      </div>
      <h2>Utwórz konto w SportLinker</h2>

      {generalError && <div className="auth-general-error">{generalError}</div>}
      {generalSuccess && <div className="auth-general-success">{generalSuccess}</div>}

      <InputField label="Imię i nazwisko">
        <Input
          placeholder="John Doe"
          type="text"
          width={100}
          icon={<LuUser color="rgb(156 163 175)" size="20px" />}
          onChange={(e) => handleChange(e)}
          value={loginData.name}
          error={errors.name}
          name="name"
          disabled={isLoading}
        />
      </InputField>
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
        onClick={registerSubmit}
        disabled={isLoading}
      >
        {isLoading ? "Tworzenie konta..." : "Utwórz konto"}
      </Button>
    </div>
  );
};

export default Register;
