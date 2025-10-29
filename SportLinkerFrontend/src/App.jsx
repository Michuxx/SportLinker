import { Route, Routes } from "react-router";
import Home from "./components/Pages/Home";

function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
    </Routes>
  );
}

export default App;
