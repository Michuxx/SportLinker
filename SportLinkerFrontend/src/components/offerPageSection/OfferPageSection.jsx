import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import OfferPageBanner from "./offerPageBanner/OfferPageBanner";
import "./offerPageSection.css";
import OfferPageContent from "./offerPageContent/OfferPageContent";
import ModalBackground from "../component-items/modal/ModalBackground";
import EditOfferModal from "../editOfferModal/EditOfferModal";
import useDateFormat from "../../hooks/useDateFormat";
import AddPeopleModal from "../addPeopleModal/AddPeopleModal";
import { toLocalDateFields } from "../../utils/dateTime";
import offerService from "../../api/offerService";
import { normalizeOfferDetails } from "../../utils/offerDetails";
import { getErrorMessage } from "../../utils/apiErrorHelper";
import useAuth from "../../hooks/useAuth";
import { useToast } from "../../context/ToastContext";
import { prepareOfferUpdate } from "../../utils/offerUpdate";

const OfferPageSection = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const updateControllerRef = useRef(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddPeopleModalOpen, setIsAddPeopleModalOpen] = useState(false);
  const [offerData, setOfferData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadedId, setLoadedId] = useState(null);
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);
    setIsEditModalOpen(false);
    setIsAddPeopleModalOpen(false);
    setIsSaving(false);

    const fetchOffer = async () => {
      try {
        const data = await offerService.getOfferDetails(id, {
          signal: controller.signal,
        });
        if (!controller.signal.aborted) {
          setOfferData(normalizeOfferDetails(data));
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setOfferData(null);
          setError(
            err.response?.status === 404
              ? "Nie znaleziono oferty."
              : getErrorMessage(err, "Nie udało się pobrać danych oferty."),
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadedId(id);
          setIsLoading(false);
        }
      }
    };

    fetchOffer();
    return () => {
      controller.abort();
      updateControllerRef.current?.abort();
    };
  }, [id, user?.id, reloadCount]);

  const currentPeople = offerData?.members.length ?? 0;
  const openSlots = Math.max(0, (offerData?.maxPeople ?? 0) - currentPeople);
  const formattedDate = useDateFormat(offerData?.date);

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
      ...toLocalDateFields(offerData.date),
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

  const handleSubmit = async () => {
    if (isSaving || updateControllerRef.current) return;
    const newErrors = {};
    let isValid = true;

    const now = new Date();
    const { date: todaysDate, time: currentTime } = toLocalDateFields(now);

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
    const playersAmount = Number(editData.maxPeople);
    if (!Number.isInteger(playersAmount)) {
      newErrors.maxPeople = "Nieprawidłowa ilość graczy";
      isValid = false;
    } else if (playersAmount < 2) {
      newErrors.maxPeople = "Musi być co najmniej 2 graczy";
      isValid = false;
    } else if (playersAmount < currentPeople) {
      newErrors.maxPeople = "Jest obecnie za dużo graczy";
      isValid = false;
    } else if (playersAmount > 100) {
      newErrors.maxPeople = "Może być maksymalnie 100 graczy";
      isValid = false;
    }

    // --- 7. DOSTEPNOSC ---
    if (playersAmount <= currentPeople && editData.availability === "Available") {
      newErrors.availability = "Oferta ma już komplet graczy";
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) {
      showToast({
        severity: "error",
        summary: "Błąd",
        detail: "Popraw błędy w formularzu oferty.",
      });
      return;
    }

    const controller = new AbortController();
    updateControllerRef.current = controller;
    setIsSaving(true);
    try {
      const { payload, changes } = prepareOfferUpdate(offerData.id, editData);
      await offerService.updateOffer(payload, { signal: controller.signal });
      if (controller.signal.aborted) return;

      setOfferData((prev) =>
        prev?.id === payload.offerId ? { ...prev, ...changes } : prev,
      );
      setIsEditModalOpen(false);
      showToast({
        severity: "success",
        summary: "Sukces",
        detail: "Oferta została zaktualizowana.",
      });
    } catch (err) {
      if (!controller.signal.aborted) {
        showToast({
          severity: "error",
          summary: "Błąd",
          detail: getErrorMessage(err, "Nie udało się zaktualizować oferty."),
        });
      }
    } finally {
      if (updateControllerRef.current === controller) {
        updateControllerRef.current = null;
      }
      if (!controller.signal.aborted) setIsSaving(false);
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

  const rejectPlayerRequest = (playerId) => {
    setOfferData((prev) => ({
      ...prev,
      requests: offerData.requests.filter((req) => req.id !== playerId),
    }));
  };

  const acceptPlayerRequest = (player) => {
    if (openSlots > 0) {
      setOfferData((prev) => {
        const updatedMembers = [
          ...prev.members,
          {
            id: player.id,
            playerId: player.playerId,
            name: player.name,
            image: player.image,
            joinDate: new Date().toISOString(),
          },
        ];

        const updatedRequests = prev.requests.filter(
          (req) => req.id !== player.id
        );

        const isFull = updatedMembers.length === Number(prev.maxPeople);

        return {
          ...prev,
          members: updatedMembers,
          requests: updatedRequests,
          availability: isFull ? "Unavailable" : "Available",
        };
      });
    }
  };

  if (isLoading || loadedId !== id) {
    return (
      <div className="offer-page-section-container offer-page-state" role="status">
        Ładowanie oferty...
      </div>
    );
  }

  if (error || !offerData) {
    return (
      <div className="offer-page-section-container offer-page-state" role="alert">
        <p>{error || "Nie znaleziono oferty."}</p>
        <button type="button" onClick={() => setReloadCount((count) => count + 1)}>
          Spróbuj ponownie
        </button>
      </div>
    );
  }

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
        <ModalBackground closeModal={() => !isSaving && setIsEditModalOpen(false)}>
          <EditOfferModal
            offerData={editData}
            errors={errors}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            isSaving={isSaving}
            handleChangeLocation={handleChangeLocation}
            handleChangeSearchQuery={handleChangeSearchQuery}
          />
        </ModalBackground>
      )}
      {isAddPeopleModalOpen && (
        <ModalBackground closeModal={() => setIsAddPeopleModalOpen(false)}>
          <AddPeopleModal
            requests={offerData.requests}
            openSlots={openSlots}
            rejectPlayerRequest={rejectPlayerRequest}
            acceptPlayerRequest={acceptPlayerRequest}
          />
        </ModalBackground>
      )}
    </div>
  );
};

export default OfferPageSection;
