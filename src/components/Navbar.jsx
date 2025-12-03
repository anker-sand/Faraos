import React, { useState } from "react";
import { NavLink } from "react-router";
import logoSrc from "../assets/img/Faraoswhitelogo.png";

const Navbar = () => {
  const [openCategory, setOpenCategory] = useState(null);
  const [anchorRect, setAnchorRect] = useState(null);

  const categories = [
    {
      name: "COMICS",
      path: "/comics",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      subcategories: [
        { name: "Danske comics", path: "/comics/danske" },
        { name: "US comics", path: "/comics/us" },
        { name: "Manga", path: "/comics/manga" },
        { name: "Graphic Novels", path: "/comics/graphic-novels" },
        { name: "Collections", path: "/comics/collections" },
      ],
    },
    {
      name: "GAMES",
      path: "/games",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
          />
        </svg>
      ),
      subcategories: [
        { name: "Brætspil", path: "/games/braetspil" },
        { name: "Dungeons and dragons", path: "/games/dnd" },
        { name: "Kortspil", path: "/games/kortspil" },
        { name: "Puzzles", path: "/games/puzzles" },
      ],
    },
    {
      name: "MINIATURES",
      path: "/miniatures",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),
      subcategories: [
        { name: "Warhammer 40k", path: "/miniatures/warhammer-40k" },
        { name: "Age of Sigmar", path: "/miniatures/age-of-sigmar" },
        { name: "Maleudstyr", path: "/miniatures/maleudstyr" },
        { name: "Tilbehør", path: "/miniatures/tilbehor" },
      ],
    },
    {
      name: "ROLLESPIL",
      path: "/rollespil",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
          />
        </svg>
      ),
      subcategories: [
        { name: "Live Rollespil Gear", path: "/rollespil/gear" },
        { name: "Kostumer", path: "/rollespil/kostumer" },
        { name: "Props & våben", path: "/rollespil/props" },
      ],
    },
    {
      name: "MERCH",
      path: "/merch",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ),
      subcategories: [
        { name: "Figurer", path: "/merch/figurer" },
        { name: "Posters", path: "/merch/posters" },
        { name: "T-shirts", path: "/merch/t-shirts" },
        { name: "Collectibles", path: "/merch/collectibles" },
      ],
    },
  ];

  return (
    <nav className="w-full fixed top-0 left-0 backdrop-blur-xl bg-neutral-950/50 relative z-[200]">
      <div className="flex items-center justify-between p-6 pl-12 relative">
        <div className="flex items-center gap-6">
          <NavLink to="/" className="flex items-center" aria-label="Go to home">
            <img
              src={logoSrc}
              alt="Faraos Logo"
              className="h-20 w-auto transition-opacity hover:opacity-80 cursor-pointer"
            />
          </NavLink>
        </div>

        <div className="flex items-center gap-10">
          {categories.map((category) => (
            <div
              key={category.name}
              className="relative"
              onMouseEnter={(e) => {
                setOpenCategory(category.name);
                const rect = e.currentTarget.getBoundingClientRect();
                setAnchorRect(rect);
              }}
              onMouseLeave={() => setOpenCategory(null)}
            >
              <button
                className={`flex items-center justify-center gap-2 w-[150px] px-4 py-3 font-geist font-bold text-xl tracking-wide transition-colors ${
                  openCategory === category.name
                    ? "text-red-500"
                    : "hover:text-red-500"
                } hover-underline hover-underline-full`}
              >
                {category.name}
                {category.icon}
              </button>

              {openCategory === category.name && (
                <div className="absolute top-full left-0 w-full backdrop-blur-xl shadow-md">
                  <ul className="font-geist text-lg text-neutral-200 space-y-2 py-4 px-6">
                    {category.subcategories.map((sub) => (
                      <li key={sub.path}>
                        <NavLink
                          to={sub.path}
                          className="block px-2 py-1 hover:text-white"
                          onClick={() => setOpenCategory(null)}
                        >
                          {sub.name}
                        </NavLink>
                      </li>
                    ))}
                    <li className="pt-2">
                      <NavLink
                        to={category.path}
                        className="block px-2 py-1 underline underline-offset-4 hover:text-white"
                        onClick={() => setOpenCategory(null)}
                      >
                        Se alle
                      </NavLink>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ))}

          <NavLink
            to="/klub-faraos"
            className="px-6 py-3 font-geist font-bold text-lg hover-underline hover-underline-full hover:text-red-500 transition-colors"
          >
            KLUB FARAOS
          </NavLink>

          <NavLink
            to="/account"
            className="p-3 hover-underline hover-underline-full"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </NavLink>

          <NavLink
            to="/cart"
            className="p-3 hover-underline hover-underline-full"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
