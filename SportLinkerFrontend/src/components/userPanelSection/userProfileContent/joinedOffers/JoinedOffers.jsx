import useAuth from "../../../../hooks/useAuth";
import useUserOfferList from "../../../../hooks/useUserOfferList";
import PageTitle from "../../../pageTitle/PageTitle";
import JoinedOfferCard from "./joinedOfferCard/JoinedOfferCard";
import NullJoinedOffers from "./nullJoinedOffers/NullJoinedOffers";
import JoinedOffersFeedback from "./joinedOffersFeedback/JoinedOffersFeedback";
import "./joinedOffers.css";

const JoinedOffers = () => {
  const { user } = useAuth();
  const { items: offers, isLoading, error, reload } = useUserOfferList(user?.id, "joined");

  return (
    <section className="joined-offers-wrapper">
      <div className="joined-offers-header">
        <PageTitle header="Dołączone oferty" label="Sportowe spotkania, w których bierzesz udział" />
      </div>
      {!user?.id ? <JoinedOffersFeedback type="login" />
        : isLoading ? <JoinedOffersFeedback type="loading" />
        : error ? <JoinedOffersFeedback type="error" onRetry={reload} />
        : offers.length === 0 ? <NullJoinedOffers />
        : <div className="joined-offers-list">{offers.map((offer) => <JoinedOfferCard key={offer.id} offer={offer} />)}</div>}
    </section>
  );
};

export default JoinedOffers;
