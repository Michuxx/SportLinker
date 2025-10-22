import Input from "../component-items/input/Input";
import InputField from "../component-items/inputField/InputField";
import Logo from "../component-items/logo/Logo";
import { MdMailOutline } from "react-icons/md";
import { GoLock } from "react-icons/go";
import "./login.css";
import Button from "../component-items/button/button";
import { useState } from "react";

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
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

  const loginSubmit = () => {
    const validatedEmail = emailValidation();
    const validatedPassword = passwordValidation();
    if (validatedEmail && validatedPassword) {
      console.log("Zalogowano");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-logo">
        <Logo />
      </div>
      <h2>Zaloguj się do SportLinker</h2>
      <InputField label="Email" error={errors.email}>
        <Input
          placeholder="John@example.com"
          type="email"
          width={100}
          icon={<MdMailOutline color="rgb(156 163 175)" size="20px" />}
          onChange={(e) => handleChange(e)}
          value={loginData.email}
          conditionalClass={errors.email}
          name="email"
        />
      </InputField>
      <InputField label="Hasło" error={errors.password}>
        <Input
          placeholder="••••••••"
          type="password"
          width={100}
          icon={<GoLock color="rgb(156 163 175)" size="20px" />}
          onChange={(e) => handleChange(e)}
          value={loginData.password}
          conditionalClass={errors.password}
          name="password"
        />
      </InputField>
      <Button style="loginButton" width={100} onClick={loginSubmit}>
        Zaloguj się
      </Button>
    </div>
  );
};

export default Login;
