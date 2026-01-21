import "./offerCardSection.css";
import OfferCard from "../offerCard/OfferCard";

const OfferCardSection = () => {
  const users = [
    {
      id: "1",
      title: "Poszukuję partnera do tenisa",
      sport: "Tenis",
      level: "intermediate",
      description:
        "Szukam osoby do regularnego grania w tenisa. Poziom średniozaawansowany, gra 2-3 razy w tygodniu.",
      date: "2025-01-20T18:00",
      location: {
        coordinates: [21.0067249, 52.2319581],
        country: "Poland",
        name: "Warsaw",
        state: "Masovian Voivodeship",
        displayLabel: "Warsaw, Masovian Voivodeship",
      },
      currentPeople: 1,
      maxPeople: 2,
      author: "Anna Kowalska",
      mode: "public",
    },
    {
      id: "2",
      title: "Poszukuję partnera do tenisa",
      sport: "Badminton",
      level: "intermediate",
      description:
        "Szukam osoby do regularnego grania w tenisa. Poziom średniozaawansowany, gra 2-3 razy w tygodniu.",
      date: "2025-01-20T18:00",
      location: {
        coordinates: [21.0067249, 52.2319581],
        country: "Poland",
        name: "Warsaw",
        state: "Masovian Voivodeship",
        displayLabel: "Warsaw, Masovian Voivodeship",
      },
      currentPeople: 1,
      maxPeople: 2,
      author: "Anna Kowalska",
      mode: "public",
    },
    {
      id: "3",
      title: "Poszukuję partnera do tenisa",
      sport: "Tenis",
      level: "intermediate",
      description:
        "Szukam osoby do regularnego grania w tenisa. Poziom średniozaawansowany, gra 2-3 razy w tygodniu.",
      date: "2025-01-20T18:00",
      location: {
        coordinates: [21.0067249, 52.2319581],
        country: "Poland",
        name: "Warsaw",
        state: "Masovian Voivodeship",
        displayLabel: "Warsaw, Masovian Voivodeship",
      },
      currentPeople: 1,
      maxPeople: 2,
      author: "Anna Kowalska",
      mode: "public",
    },
    {
      id: "4",
      title: "Poszukuję partnera do tenisa",
      sport: "Tenis",
      level: "intermediate",
      description:
        "Szukam osoby do regularnego grania w tenisa. Poziom średniozaawansowany, gra 2-3 razy w tygodniu.",
      date: "2025-01-20T18:00",
      location: {
        coordinates: [21.0067249, 52.2319581],
        country: "Poland",
        name: "Warsaw",
        state: "Masovian Voivodeship",
        displayLabel: "Warsaw, Masovian Voivodeship",
      },
      currentPeople: 1,
      maxPeople: 2,
      author: "Anna Kowalska",
      mode: "public",
    },
  ];

  return (
    <section className="offer-card-section-wrapper" id="offers">
      {users.map((offer) => (
        <OfferCard
          id={offer.id}
          title={offer.title}
          sport={offer.sport}
          level={offer.level}
          description={offer.description}
          date={offer.date}
          location={offer.location}
          currentPeople={offer.currentPeople}
          maxPeople={offer.maxPeople}
          author={offer.author}
          mode={offer.mode}
        />
      ))}
    </section>
  );
};

export default OfferCardSection;
