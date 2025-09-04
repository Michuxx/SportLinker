import "./App.css";
import Header from "./components/header/Header";
import WelcomeBanner from "./components/welcomeBanner/welcomeBanner";

function App() {
  return (
    <div className="container">
      <Header />
      <WelcomeBanner />
    </div>
  );
}

export default App;
