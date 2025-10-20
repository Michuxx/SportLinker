import Input from "../component-items/input/Input";
import InputField from "../component-items/inputField/InputField";
import Logo from "../component-items/logo/Logo";
import { MdMailOutline } from "react-icons/md";
import { GoLock } from "react-icons/go";
import "./login.css";
import Button from "../component-items/button/button";
import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailErr, setEmailErr] = useState();
  const [passwordErr, setPasswordErr] = useState();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const onEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailErr("");
  };

  const onPasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordErr("");
  };

  const emailValidation = () => {
    if (email.length === 0 || !emailRegex.test(email)) {
      setEmailErr("Twój email jest nieprawidłowy");
      return false;
    }
    return true;
  };

  const passwordValidation = () => {
    if (password.length < 6) {
      setPasswordErr("Hasło musi mieć conajmniej 6 znaków");
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
      <Logo />
      <h2>Zaloguj się do SportLinker</h2>
      <InputField label="Email" error={emailErr}>
        <Input
          placeholder="John@example.com"
          type="email"
          width={100}
          icon={<MdMailOutline color="rgb(156 163 175)" size="20px" />}
          onChange={(e) => onEmailChange(e)}
          value={email}
          conditionalClass={emailErr}
        />
      </InputField>
      <InputField label="Hasło" error={passwordErr}>
        <Input
          placeholder="••••••••"
          type="password"
          width={100}
          icon={<GoLock color="rgb(156 163 175)" size="20px" />}
          onChange={(e) => onPasswordChange(e)}
          value={password}
          conditionalClass={passwordErr}
        />
      </InputField>
      <Button style="loginButton" width={100} onClick={loginSubmit}>
        Zaloguj się
      </Button>
    </div>
  );
};

export default Login;
