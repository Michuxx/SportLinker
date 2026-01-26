import { useEffect, useState } from "react";
import OfferPageBanner from "./offerPageBanner/OfferPageBanner";
import "./offerPageSection.css";
import OfferPageContent from "./offerPageContent/OfferPageContent";
import ModalBackground from "../component-items/modal/ModalBackground";
import EditOfferModal from "../editOfferModal/EditOfferModal";
import useDateFormat from "../../hooks/useDateFormat";
import AddPeopleModal from "../addPeopleModal/AddPeopleModal";

const OfferPageSection = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddPeopleModalOpen, setIsAddPeopleModalOpen] = useState(false);
  const [currentPeople, setCurrentPeople] = useState();
  const [openSlots, setOpenSlots] = useState();

  const [offerData, setOfferData] = useState({
    id: 1,
    title: "Poszukuję partnera do tenisa",
    sport: "Tenis",
    level: "expert",
    description:
      "Szukam osoby do regularnego grania w tenisa. Poziom średniozaawansowany, gra 2-3 razy w tygodniu.",
    date: "2027-01-20T18:00",
    creationDate: "04.12.2025",
    location: {
      city: "Wrocław",
      country: "Poland",
      displayLabel: "Wrocław, ul. Góralska, Hasta La Vista",
      houseNumber: "",
      lat: 51.1088336,
      long: 17.0020515,
      name: "Hasta La Vista",
      state: "Lower Silesian Voivodeship",
      street: "Góralska",
      type: "house",
    },
    maxPeople: 4,
    availability: "closed",
    mode: "private", // private, public
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
    requests: [
      {
        id: 6,
        name: "Ola",
      },
      {
        id: 8,
        name: "Mariusz",
      },
      {
        id: 16,
        name: "Robert",
      },
    ],
  });

  const formattedDate = useDateFormat(offerData.date);

  const [errors, setErrors] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    time: "",
    maxPeople: "",
  });

  const [editData, setEditData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    time: "",
    maxPeople: "",
    level: "",
    mode: "",
    availability: "",
  });

  const handleOpenEditModal = () => {
    setEditData({
      title: offerData.title,
      description: offerData.description,
      location: offerData.location,
      locationQuery: `${offerData.location.displayLabel}`,
      date: offerData.date.split("T")[0],
      time: offerData.date.split("T")[1],
      maxPeople: offerData.maxPeople,
      level: offerData.level,
      mode: offerData.mode,
      availability: offerData.availability,
    });
    setErrors({
      title: "",
      description: "",
      locationQuery: "",
      date: "",
      time: "",
      maxPeople: "",
      availability: "",
    });
    setIsEditModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleChangeSearchQuery = (e) => {
    setEditData((prev) => ({
      ...prev,
      locationQuery: e,
      location: null,
    }));
    setErrors((prev) => ({
      ...prev,
      locationQuery: "",
    }));
  };

  const handleChangeLocation = (newLocation) => {
    setEditData((prev) => ({ ...prev, location: newLocation }));
    setErrors((prev) => ({
      ...prev,
      locationQuery: "",
    }));
  };

  const handleSubmit = () => {
    const newErrors = {};
    let isValid = true;
    let normalizedDate;

    const now = new Date();
    const todaysDate = now.toLocaleDateString("en-CA");
    const currentTime = now.toLocaleTimeString("pl-PL", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // --- 1. TYTUŁ ---
    if (!editData.title.trim()) {
      newErrors.title = "Tytuł nie może być pusty";
      isValid = false;
    } else if (editData.title.length > 50) {
      newErrors.title = "Tytuł nie może mieć więcej niż 50 znaków";
      isValid = false;
    }

    // --- 2. OPIS ---
    if (!editData.description.trim()) {
      newErrors.description = "Opis nie może być pusty";
      isValid = false;
    } else if (editData.description.length > 180) {
      newErrors.description = "Opis nie może mieć więcej niż 180 znaków";
      isValid = false;
    }

    // --- 3. LOCATION ---
    if (!editData.locationQuery.trim() || editData.location === null) {
      newErrors.locationQuery =
        "Lokalizacja nie może być pusta. Wybierz ją z listy";
      isValid = false;
    }

    // --- 4. DATA ---
    if (!editData.date) {
      newErrors.date = "Data nie może być pusta";
      isValid = false;
    } else if (editData.date < todaysDate) {
      newErrors.date = "Data nie może być wcześniejsza niż dziś";
      isValid = false;
    }

    // --- 5. GODZINA ---
    if (!editData.time) {
      newErrors.time = "Godzina spotkania nie może być pusta";
      isValid = false;
    } else if (editData.date === todaysDate && editData.time < currentTime) {
      newErrors.time = "Godzina spotkania nie może być wcześniejsza niż teraz";
      isValid = false;
    }

    // --- 6. GRACZE ---
    const playersAmount = parseInt(editData.maxPeople);
    if (isNaN(playersAmount)) {
      newErrors.maxPeople = "Nieprawidłowa ilość graczy";
      isValid = false;
    } else if (playersAmount < currentPeople) {
      newErrors.maxPeople = "Jest obecnie za dużo graczy";
      isValid = false;
    } else if (playersAmount < 2) {
      newErrors.maxPeople = "Musi być co najmniej 2 graczy";
      isValid = false;
    } else if (playersAmount > 30) {
      newErrors.maxPeople = "Może być maksymalnie 30 graczy";
      isValid = false;
    }

    // --- 7. DOSTEPNOSC ---
    if (playersAmount <= currentPeople && editData.availability === "open") {
      newErrors.availability = "Oferta ma już komplet graczy";
      isValid = false;
    }

    setErrors(newErrors);

    normalizedDate = `${editData.date}T${editData.time}`;

    if (isValid) {
      setOfferData((prev) => ({ ...prev, ...editData, date: normalizedDate }));
      setIsEditModalOpen(false);
    }
  };

  const joinOffer = () => {
    switch (offerData.mode) {
      case "public":
        setOfferData((prev) => ({ ...prev, status: "accepted" }));
        break;
      case "private":
        setOfferData((prev) => ({ ...prev, status: "pending" }));
    }
  };

  const kickPlayer = (memberId) => {
    setOfferData((prev) => ({
      ...prev,
      members: offerData.members.filter((member) => member.id !== memberId),
    }));
  };

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
        leaveOffer={() => setOfferData((prev) => ({ ...prev, status: null }))}
        joinOffer={joinOffer}
      />
      <OfferPageContent
        offerData={offerData}
        openSlots={openSlots}
        openEditModal={handleOpenEditModal}
        openAddPeopleModal={() => setIsAddPeopleModalOpen((e) => !e)}
        kickPlayer={kickPlayer}
      />
      {isEditModalOpen && (
        <ModalBackground closeModal={() => setIsEditModalOpen(false)}>
          <EditOfferModal
            offerData={editData}
            errors={errors}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleChangeLocation={handleChangeLocation}
            handleChangeSearchQuery={handleChangeSearchQuery}
          />
        </ModalBackground>
      )}
      {isAddPeopleModalOpen && (
        <ModalBackground closeModal={() => setIsAddPeopleModalOpen(false)}>
          <AddPeopleModal requests={offerData.requests} />
        </ModalBackground>
      )}
    </div>
  );
};

export default OfferPageSection;
