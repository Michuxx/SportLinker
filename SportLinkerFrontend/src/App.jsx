import { Route, Routes } from "react-router";
import Home from "./components/Pages/Home";
import Profile from "./components/Pages/Profile";

function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="profile">
        <Route index element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default App;
