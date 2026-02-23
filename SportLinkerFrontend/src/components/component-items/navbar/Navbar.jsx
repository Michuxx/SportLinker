import "./navbar.css";

const Navbar = ({ children, className }) => {
  return <div className={`${className}-navbar navbar-wrapper`}>{children}</div>;
};

export default Navbar;
