import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home.jsx";
import Daredevil from "./pages/Daredevil.jsx";
import Navbar from "./components/Navbar.jsx";
import ComicsStore from "./pages/ComicsStore.jsx";
import OldMegaMenuNavbar from "./pages/OldMegaMenuNavbar.jsx";

const App = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="min-h-screen bg-faraos-bg text-neutral-100">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/daredevil" element={<Daredevil />} />
            <Route path="/comics" element={<ComicsStore />} />
            <Route path="/oldmegamenunavbar" element={<OldMegaMenuNavbar />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
