const UserDetailedBackground = ({ title, children }) => {
  return (
    <div className="user-detailed-background">
      <h3>{title}</h3>
      {children}
    </div>
  );
};

export default UserDetailedBackground;
