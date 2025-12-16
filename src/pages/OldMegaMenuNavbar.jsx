import React, { useEffect } from "react";
import OldNavbar from "../components/OldNavbar.jsx";

const OldMegaMenuNavbar = () => {
  useEffect(() => {
    const el = document.getElementById("global-navbar");
    if (!el) return;
    const prevDisplay = el.style.display;
    el.style.display = "none";
    return () => {
      el.style.display = prevDisplay;
    };
  }, []);
  return (
    <div className="min-h-screen bg-faraos-bg text-neutral-100">
      <OldNavbar />
      <div className="pt-32 px-12">
        <div className="max-w-4xl mx-auto"></div>
      </div>
    </div>
  );
};

export default OldMegaMenuNavbar;
