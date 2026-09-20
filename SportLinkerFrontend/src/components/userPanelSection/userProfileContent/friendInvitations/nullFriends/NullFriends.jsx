import NullComponent from "../../../../component-items/nullComponent/NullComponent";
import "./nullFriends.css";
const NullFriends = () => {
  return (
    <div className="null-friends-wrapper">
      <NullComponent
        icon="🤷‍♂️"
        title="Brak zaproszeń do znajomych"
        text="Nikt nie wysłał ci zaproszenia do znajomych"
      ></NullComponent>
    </div>
  );
};

export default NullFriends;
