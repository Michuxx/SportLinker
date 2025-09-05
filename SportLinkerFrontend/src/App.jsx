import "./App.css";
import Header from "./components/headerSection/Header";
import WelcomeBanner from "./components/bannerSection/welcomeBanner";
import OfferSection from "./components/offerSection/OfferSection";
import OfferFilter from "./components/offerSection/offerFilter/OfferFilter";

function App() {
  return (
    <div className="container">
      <Header />
      <WelcomeBanner />
      <OfferSection>
        <OfferFilter />
      </OfferSection>
    </div>
  );
}

export default App;
