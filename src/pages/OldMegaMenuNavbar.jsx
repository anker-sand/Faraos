import React from "react";
import OldNavbar from "../components/OldNavbar.jsx";

const OldMegaMenuNavbar = () => {
  return (
    <div className="min-h-screen bg-faraos-bg text-neutral-100">
      <OldNavbar />
      <div className="pt-32 px-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-geist font-bold mb-6">
            Old Mega Menu Navbar
          </h1>
          <p className="text-xl text-neutral-300 mb-8">
            This page preserves the original mega menu navbar design for
            reference.
          </p>
          <div className="bg-neutral-900 rounded-lg p-8 border border-neutral-800">
            <h2 className="text-2xl font-geist font-bold mb-4">Features:</h2>
            <ul className="space-y-3 text-lg text-neutral-300">
              <li>• Hover over "SHOP" to reveal the full mega menu</li>
              <li>• All categories displayed in a single grid layout</li>
              <li>• Expanding search bar animation</li>
              <li>• Category images with hover effects</li>
              <li>• Red hover state on category titles</li>
              <li>• Smooth dropdown animations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OldMegaMenuNavbar;
