import "./App.css";
import Header from "./components/headerSection/Header";
import WelcomeBanner from "./components/bannerSection/welcomeBanner";
import OfferFilterSection from "./components/offerFilterSection/OfferFilterSection";

function App() {
  return (
    <div className="container">
      <Header />
      <WelcomeBanner />
      <OfferFilterSection />
    </div>
  );
}

export default App;
