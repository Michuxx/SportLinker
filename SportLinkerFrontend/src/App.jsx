import "./App.css";
import Header from "./components/headerSection/Header";
import WelcomeBanner from "./components/bannerSection/welcomeBanner";
import OfferSection from "./components/offerSection/offerSection";

function App() {
  return (
    <div className="container">
      <Header />
      <WelcomeBanner />
      <OfferSection />
    </div>
  );
}

export default App;
