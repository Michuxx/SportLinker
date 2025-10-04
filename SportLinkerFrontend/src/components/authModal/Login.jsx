import Input from "../component-items/input/Input";
import InputField from "../component-items/inputField/InputField";
import Logo from "../component-items/logo/Logo";
import { MdMailOutline } from "react-icons/md";
import { GoLock } from "react-icons/go";
import "./login.css";
import Button from "../component-items/button/button";

const Login = () => {
  return (
    <div className="login-wrapper">
      <Logo />
      <h2>Zaloguj się do SportLinker</h2>
      <InputField label="Email">
        <Input
          placeholder="John@example.com"
          type="email"
          width={100}
          icon={<MdMailOutline color="rgb(156 163 175)" size="20px" />}
        />
      </InputField>
      <InputField label="Hasło">
        <Input
          placeholder="••••••••"
          type="password"
          width={100}
          icon={<GoLock color="rgb(156 163 175)" size="20px" />}
        />
      </InputField>
      <Button style="loginButton" width={100}>
        Zaloguj się
      </Button>
    </div>
  );
};

export default Login;
