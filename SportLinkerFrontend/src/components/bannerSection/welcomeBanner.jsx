import "./welcomeBanner.css";
import Button from "../component-items/button/button";
import Feature from "./Feature";

const WelcomeBanner = () => {
  return (
    <div className="banner">
      <div className="banner-headline">
        <h1>Znajdź swoich</h1>
        <h1>partnerów sportowych</h1>
      </div>
      <div className="headline-description">
        <p>
          Dołącz do społeczności aktywnych ludzi. Wystawiaj oferty, znajduj
          graczy i rozwijaj swoją pasję do sportu.
        </p>
      </div>
      <div className="banner-btn-section">
        <Button text="Utwórz ofertę" style="createOfferButton" width={45} />
        <Button text="Przeglądaj oferty" style="outlineButton" width={45} />
      </div>
      <div className="banner-features-wrapper">
        <Feature
          title="Społeczność"
          description="Poznaj nowych ludzi z podobnymi zainteresowaniami sportowymi"
        />
        <Feature
          title="Różne poziomy"
          description="Od początkujących po zaawansowanych - każdy znajdzie coś dla siebie"
        />
        <Feature
          title="Lokalne spotkania"
          description="Znajdź aktywności sportowe w swojej okolicy"
        />
      </div>
    </div>
  );
};

export default WelcomeBanner;
