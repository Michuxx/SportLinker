import "./offerCardSection.css";
import OfferCard from "../offerCard/offerCard";

const OfferCardSection = () => {
  return (
    <section className="offer-card-section-wrapper">
      <OfferCard
        title="Poszukuję partnera do tenisa"
        sport="Tenis"
        level="mid"
        description="Szukam osoby do regularnego grania w tenisa. Poziom średniozaawansowany, gra 2-3 razy w tygodniu."
        date="pon., 20.01, 18:00"
        location="Warszawa, Mokotów"
        currentPeople={1}
        maxPeople={2}
        author="Anna Kowalska"
      />
      <OfferCard
        title="Turniej badmintona - szukamy graczy"
        sport="Badminton"
        level="easy"
        description="Organizujemy turniej badmintona dla początkujących. Miła atmosfera gwarantowana!"
        date="śr., 22.01, 16:00"
        location="Kraków, Centrum"
        currentPeople={3}
        maxPeople={8}
        author="Anna Kowalska"
      />
      <OfferCard
        title="Turniej badmintona - szukamy graczy"
        sport="Badminton"
        level="expert"
        description="Organizujemy turniej badmintona dla początkujących. Miła atmosfera gwarantowana!"
        date="śr., 22.01, 16:00"
        location="Kraków, Centrum"
        currentPeople={3}
        maxPeople={8}
        author="Anna Kowalska"
      />
      <OfferCard
        title="Mecz piłki nożnej - brakuje 4 osób"
        sport="Piłka nożna"
        level="any"
        description="Gramy co sobotę o 10:00. Potrzebujemy jeszcze 4 graczy do kompletu drużyn."
        date="sob., 25.01, 10:00"
        location="Gdańsk, Przymorze"
        currentPeople={18}
        maxPeople={22}
        author="Anna Kowalska"
      />
    </section>
  );
};

export default OfferCardSection;
