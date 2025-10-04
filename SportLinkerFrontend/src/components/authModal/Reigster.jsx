import Button from "../component-items/button/button";
import Input from "../component-items/input/Input";
import InputField from "../component-items/inputField/InputField";
import Logo from "../component-items/logo/Logo";
import "./register.css";
import { MdMailOutline } from "react-icons/md";
import { GoLock } from "react-icons/go";
import { LuUser } from "react-icons/lu";

const Register = () => {
  return (
    <div className="register-wrapper">
      <Logo />
      <h2>Utwórz konto w SportLinker</h2>
      <InputField label="Imię i nazwisko">
        <Input
          placeholder="John Doe"
          type="text"
          width={100}
          icon={<LuUser color="rgb(156 163 175)" size="20px" />}
        />
      </InputField>
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
        Utwórz konto
      </Button>
    </div>
  );
};

export default Register;
