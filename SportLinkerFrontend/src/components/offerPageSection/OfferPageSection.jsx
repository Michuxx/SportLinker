import { useEffect, useState } from "react";
import OfferPageBanner from "./offerPageBanner/OfferPageBanner";
import "./offerPageSection.css";
import OfferPageContent from "./offerPageContent/OfferPageContent";
import ModalBackground from "../component-items/modal/ModalBackground";
import EditOfferModal from "../editOfferModal/EditOfferModal";
import useDateFormat from "../../hooks/useDateFormat";

const OfferPageSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPeople, setCurrentPeople] = useState();
  const [openSlots, setOpenSlots] = useState();

  const [offerData, setOfferData] = useState({
    id: 1,
    title: "Poszukuję partnera do tenisa",
    sport: "Tenis",
    level: "expert",
    description:
      "Szukam osoby do regularnego grania w tenisa. Poziom średniozaawansowany, gra 2-3 razy w tygodniu.",
    date: "2025-01-20T18:00",
    creationDate: "04.12.2025",
    location: "Warszawa, Mokotów",
    maxPeople: 4,
    availability: "closed",
    mode: "private",
    status: "pending", // pending, rejected, accepted, null
    authorId: 1,
    author: {
      id: 1,
      name: "Macius",
      joinDate: "02.12.2025",
    },
    members: [
      {
        id: 2,
        name: "Kuba",
        joinDate: "02.12.2025",
      },
      {
        id: 3,
        name: "Janusz",
        joinDate: "02.12.2025",
      },
      {
        id: 4,
        name: "Martusiem",
        joinDate: "02.12.2025",
      },
    ],
  });

  const formattedDate = useDateFormat(offerData.date);

  console.log(formattedDate);

  const [errors, setErrors] = useState({
    sport: "",
    title: "",
    description: "",
    location: "",
    date: "",
    time: "",
    maxPeople: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOfferData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleChangeDate = (e) => {
    const newDate = e.target.value;
    const currentTime = offerData.date.split("T")[1] || "00:00";

    setOfferData((prev) => ({
      ...prev,
      date: `${newDate}T${currentTime}`,
    }));
  };
  const handleChangeTime = (e) => {
    const newTime = e.target.value;
    const currentDate = offerData.date.split("T")[0];

    setOfferData((prev) => ({
      ...prev,
      date: `${currentDate}T${newTime}`,
    }));
  };

  const handleSubmit = () => {};

  useEffect(() => {
    let counter = 1;
    counter += offerData.members.length;
    setCurrentPeople(counter);
    setOpenSlots(offerData.maxPeople - counter);
  }, [offerData]);

  return (
    <div className="offer-page-section-container">
      <OfferPageBanner
        offerData={offerData}
        currentPeople={currentPeople}
        formattedDate={formattedDate}
      />
      <OfferPageContent
        offerData={offerData}
        openSlots={openSlots}
        openEditModal={() => setIsModalOpen(true)}
      />
      {isModalOpen && (
        <ModalBackground closeModal={() => setIsModalOpen(false)}>
          <EditOfferModal
            offerData={offerData}
            errors={errors}
            handleChange={handleChange}
            handleChangeDate={handleChangeDate}
            handleSubmit={handleSubmit}
            handleChangeTime={handleChangeTime}
          />
        </ModalBackground>
      )}
    </div>
  );
};

export default OfferPageSection;
