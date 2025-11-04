import Button from "../../../../component-items/button/button";
import NullComponent from "../../../../component-items/nullComponent/NullComponent";
import "./nullOffers.css";

const NullOffers = () => {
  return (
    <div className="null-offers-wrapper">
      <NullComponent
        title="Brak ofert"
        text="Nie utworzyłeś jeszcze żadnych ofert sportowych"
        icon="🏃‍♂️"
      >
        <Button style="gradientButton" width={20}>
          Utwórz ofertę
        </Button>
      </NullComponent>
    </div>
  );
};

export default NullOffers;
