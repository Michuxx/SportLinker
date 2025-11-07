import Button from "../component-items/button/button";
import Input from "../component-items/input/Input";
import InputField from "../component-items/inputField/InputField";
import Logo from "../component-items/logo/Logo";
import "./register.css";
import { MdMailOutline } from "react-icons/md";
import { GoLock } from "react-icons/go";
import { LuUser } from "react-icons/lu";
import { useState } from "react";

const Register = () => {
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

  const registerSubmit = () => {
    const validatedName = nameValidation();
    const validatedEmail = emailValidation();
    const validatedPassword = passwordValidation();

    if (validatedEmail && validatedPassword && validatedName) {
      console.log("Zarejestrowano");
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-logo">
        <Logo />
      </div>
      <h2>Utwórz konto w SportLinker</h2>
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
        />
      </InputField>
      <Button style="loginButton" width={100} onClick={registerSubmit}>
        Utwórz konto
      </Button>
    </div>
  );
};

export default Register;
