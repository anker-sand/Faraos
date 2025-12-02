import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home.jsx";
import Daredevil from "./pages/Daredevil.jsx";
import Navbar from "./components/Navbar.jsx";
import ComicsStore from "./pages/ComicsStore.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-neutral-950 text-neutral-100">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/daredevil" element={<Daredevil />} />
            <Route path="/comics" element={<ComicsStore />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
