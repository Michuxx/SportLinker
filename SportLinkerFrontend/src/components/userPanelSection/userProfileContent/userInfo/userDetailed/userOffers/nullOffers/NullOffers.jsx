import NullComponent from "../../../../../../component-items/nullComponent/NullComponent";
import "./nullOffers.css";
import Button from "../../../../../../component-items/button/button";

const NullOffers = ({ isOwner = false, onCreate }) => (
  <div className="null-offers-wrapper">
    <NullComponent title="Brak ofert"
      text={isOwner ? "Nie utworzyłeś jeszcze żadnych ofert sportowych" : "Ten użytkownik nie utworzył jeszcze żadnych ofert sportowych"}
      icon="🏃‍♂️">
      {isOwner && <Button style="gradientButton" onClick={onCreate}>Utwórz ofertę</Button>}
    </NullComponent>
  </div>
);

export default NullOffers;
