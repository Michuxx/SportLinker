import "./App.css";
import Header from "./components/headerSection/Header";
import WelcomeBanner from "./components/bannerSection/welcomeBanner";

function App() {
  return (
    <div className="container">
      <Header />
      <WelcomeBanner />
    </div>
  );
}

export default App;
