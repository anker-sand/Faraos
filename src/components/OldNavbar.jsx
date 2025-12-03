import React, { useState } from "react";
import { NavLink } from "react-router";
import logoSrc from "../assets/img/Faraoswhitelogo.png";
import comicsImg from "../assets/img/nav/comicsimg.jpg";
import rollespilImg from "../assets/img/nav/rollespil.jpg";

const OldNavbar = () => {
  const [isShopOpen, setIsShopOpen] = useState(false);

  return (
    <nav className="w-full absolute top-0 left-0 z-50 bg-neutral-950/100 border-b border-neutral-800">
      <div className="flex items-center justify-between p-6 pl-12 pt-8">
        {/* Left side: Logo */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <NavLink to="/" className="flex items-center" aria-label="Go to home">
            <img
              src={logoSrc}
              alt="Faraos Logo"
              className="h-20 w-auto transition-opacity hover:opacity-80 cursor-pointer"
            />
          </NavLink>
        </div>

        {/* Right side: Search, SHOP, KLUB FARAOS, User, Cart */}
        <div className="flex items-center gap-8">
          {/* Search and SHOP with mega menu */}
          <div
            className="relative"
            onMouseEnter={() => setIsShopOpen(true)}
            onMouseLeave={() => setIsShopOpen(false)}
          >
            {/* Search Icon with expanding input and SHOP Button */}
            <div className="flex items-center">
              {/* Search bar container with absolute positioning to prevent layout shift */}
              <div className="relative h-[50px] w-0 flex items-center">
                <div
                  className={`absolute right-0 flex items-center overflow-hidden transition-all ease-in-out ${
                    isShopOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                  style={{
                    width: isShopOpen ? "420px" : "0px",
                    transitionDuration: "400ms",
                    transitionDelay: isShopOpen ? "300ms" : "0ms",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full h-[50px] px-5 pr-12 bg-neutral-900 border border-neutral-800 border-r-0 rounded-l font-geist text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-neutral-600 text-lg"
                    autoFocus={isShopOpen}
                  />
                </div>
              </div>
              <button
                className={`relative z-10 h-[50px] w-[50px] flex items-center justify-center border ${
                  isShopOpen
                    ? "bg-neutral-900 border-neutral-800 border-b-0 border-r-0"
                    : "border-transparent"
                }`}
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
              <button
                className={`h-[50px] px-6 font-geist font-bold text-lg border ${
                  isShopOpen
                    ? "bg-neutral-900 border-neutral-800 border-b-0 border-l-0"
                    : "border-transparent"
                }`}
              >
                SHOP
              </button>
            </div>

            {isShopOpen && (
              <div className="absolute top-full right-0 mt-0 ml-auto w-[1150px] bg-neutral-900 border border-neutral-700 shadow-2xl animate-slide-down rounded-b-lg overflow-hidden">
                {/* Categories Grid */}
                <div className="grid grid-cols-5 items-stretch">
                  <div className="group px-8 py-10 border-r border-neutral-800 hover:bg-neutral-800/50 transition-all duration-300 flex flex-col">
                    {/* Category Image and Title Group */}
                    <div className="group/title">
                      <NavLink
                        to="/comics"
                        aria-label="Se alle Comics"
                        className="block"
                      >
                        <div className="mb-5 rounded-lg overflow-hidden shadow-lg ring-1 ring-neutral-700/50 group-hover/title:ring-neutral-600 transition-all">
                          <img
                            src={comicsImg}
                            alt="Comics"
                            className="w-full h-36 object-cover group-hover/title:scale-110 transition-transform duration-300"
                          />
                        </div>
                      </NavLink>
                      <NavLink
                        to="/comics"
                        className="flex items-center gap-2 mb-5 font-geist font-bold text-lg tracking-wider hover-underline group-hover/title:text-red-500 transition-colors"
                      >
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
                        COMICS
                      </NavLink>
                    </div>
                    <ul className="space-y-2.5 font-geist text-lg text-neutral-400">
                      <li>
                        <NavLink
                          to="/comics/danske"
                          className="block -mx-6 px-6 py-1 rounded hover:bg-neutral-800/60 hover:text-neutral-100 transition-colors focus:outline-none focus:bg-neutral-700"
                        >
                          Danske comics
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/comics/us"
                          className="block -mx-6 px-6 py-1 rounded hover:bg-neutral-800/60 hover:text-neutral-100 transition-colors focus:outline-none focus:bg-neutral-700"
                        >
                          US comics
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/comics/manga"
                          className="block -mx-6 px-6 py-1 rounded hover:bg-neutral-800/60 hover:text-neutral-100 transition-colors focus:outline-none focus:bg-neutral-700"
                        >
                          Manga
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/comics/graphic-novels"
                          className="block -mx-6 px-6 py-1 rounded hover:bg-neutral-800/60 hover:text-neutral-100 transition-colors focus:outline-none focus:bg-neutral-700"
                        >
                          Graphic Novels
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/comics/collections"
                          className="block -mx-6 px-6 py-1 rounded hover:bg-neutral-800/60 hover:text-neutral-100 transition-colors focus:outline-none focus:bg-neutral-700"
                        >
                          Collections
                        </NavLink>
                      </li>
                    </ul>
                    <div className="mt-auto pt-7">
                      <NavLink
                        to="/comics"
                        className="inline-block text-lg font-geist text-neutral-200 hover:text-white underline underline-offset-4"
                      >
                        Se alle
                      </NavLink>
                    </div>
                  </div>
                  <div className="group px-8 py-10 border-r border-neutral-800 hover:bg-neutral-800/50 transition-all duration-300 flex flex-col">
                    {/* Category Image and Title Group */}
                    <div className="group/title">
                      <NavLink
                        to="/games"
                        aria-label="Se alle Games"
                        className="block"
                      >
                        <div className="mb-5 rounded-lg overflow-hidden shadow-lg ring-1 ring-neutral-700/50 group-hover/title:ring-neutral-600 transition-all">
                          <img
                            src={comicsImg}
                            alt="Games"
                            className="w-full h-36 object-cover group-hover/title:scale-110 transition-transform duration-300"
                          />
                        </div>
                      </NavLink>
                      <NavLink
                        to="/games"
                        className="flex items-center gap-2 mb-5 font-geist font-bold text-lg tracking-wider hover-underline group-hover/title:text-red-500 transition-colors"
                      >
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
                        GAMES
                      </NavLink>
                    </div>
                    <ul className="space-y-2.5 font-geist text-lg text-neutral-400">
                      <li>
                        <NavLink
                          to="/games/braetspil"
                          className="block -mx-6 px-6 py-1 rounded hover:bg-neutral-800/60 hover:text-neutral-100 transition-colors focus:outline-none focus:bg-neutral-700"
                        >
                          Brætspil
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/games/dnd"
                          className="block -mx-6 px-6 py-1 rounded hover:bg-neutral-800/60 hover:text-neutral-100 transition-colors focus:outline-none focus:bg-neutral-700"
                        >
                          Dungeons and dragons
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/games/kortspil"
                          className="block -mx-6 px-6 py-1 rounded hover:bg-neutral-800/60 hover:text-neutral-100 transition-colors focus:outline-none focus:bg-neutral-700"
                        >
                          Kortspil
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/games/puzzles"
                          className="block -mx-6 px-6 py-1 rounded hover:bg-neutral-800/60 hover:text-neutral-100 transition-colors focus:outline-none focus:bg-neutral-700"
                        >
                          Puzzles
                        </NavLink>
                      </li>
                    </ul>
                    <div className="mt-auto pt-7">
                      <NavLink
                        to="/games"
                        className="inline-block text-lg font-geist text-neutral-200 hover:text-white underline underline-offset-4"
                      >
                        Se alle
                      </NavLink>
                    </div>
                  </div>
                  <div className="group px-8 py-10 border-r border-neutral-800 hover:bg-neutral-800/50 transition-all duration-300 flex flex-col">
                    {/* Category Image and Title Group */}
                    <div className="group/title">
                      <NavLink
                        to="/miniatures"
                        aria-label="Se alle Miniatures"
                        className="block"
                      >
                        <div className="mb-5 rounded-lg overflow-hidden shadow-lg ring-1 ring-neutral-700/50 group-hover/title:ring-neutral-600 transition-all">
                          <img
                            src={comicsImg}
                            alt="Miniatures"
                            className="w-full h-36 object-cover group-hover/title:scale-110 transition-transform duration-300"
                          />
                        </div>
                      </NavLink>
                      <NavLink
                        to="/miniatures"
                        className="flex items-center gap-2 mb-5 font-geist font-bold text-lg tracking-wider hover-underline group-hover/title:text-red-500 transition-colors"
                      >
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
                        MINIATURES
                      </NavLink>
                    </div>
                    <ul className="space-y-2.5 font-geist text-lg text-neutral-400">
                      <li>
                        <NavLink
                          to="/miniatures/warhammer-40k"
                          className="block -mx-6 px-6 py-1 rounded hover:bg-neutral-800/60 hover:text-neutral-100 transition-colors focus:outline-none focus:bg-neutral-700"
                        >
                          Warhammer 40k
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/miniatures/age-of-sigmar"
                          className="block -mx-6 px-6 py-1 rounded hover:bg-neutral-800/60 hover:text-neutral-100 transition-colors focus:outline-none focus:bg-neutral-700"
                        >
                          Age of Sigmar
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/miniatures/maleudstyr"
                          className="block -mx-6 px-6 py-1 rounded hover:bg-neutral-800/60 hover:text-neutral-100 transition-colors focus:outline-none focus:bg-neutral-700"
                        >
                          Maleudstyr
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/miniatures/tilbehor"
                          className="block -mx-6 px-6 py-1 rounded hover:bg-neutral-800/60 hover:text-neutral-100 transition-colors focus:outline-none focus:bg-neutral-700"
                        >
                          Tilbehør
                        </NavLink>
                      </li>
                    </ul>
                    <div className="mt-auto pt-7">
                      <NavLink
                        to="/miniatures"
                        className="inline-block text-lg font-geist text-neutral-200 hover:text-white underline underline-offset-4"
                      >
                        Se alle
                      </NavLink>
                    </div>
                  </div>
                  <div className="group px-8 py-10 border-r border-neutral-800 hover:bg-neutral-800/50 transition-all duration-300 flex flex-col">
                    {/* Category Image and Title Group */}
                    <div className="group/title">
                      <NavLink
                        to="/rollespil"
                        aria-label="Se alle Rollespil"
                        className="block"
                      >
                        <div className="mb-5 rounded-lg overflow-hidden shadow-lg ring-1 ring-neutral-700/50 group-hover/title:ring-neutral-600 transition-all">
                          <img
                            src={rollespilImg}
                            alt="Rollespil"
                            className="w-full h-36 object-cover group-hover/title:scale-110 transition-transform duration-300"
                          />
                        </div>
                      </NavLink>
                      <NavLink
                        to="/rollespil"
                        className="flex items-center gap-2 mb-5 font-geist font-bold text-lg tracking-wider hover-underline group-hover/title:text-red-500 transition-colors"
                      >
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
                        ROLLESPIL
                      </NavLink>
                    </div>
                    <ul className="space-y-2.5 font-geist text-lg text-neutral-400">
                      <li>
                        <NavLink
                          to="/rollespil/gear"
                          className="block -mx-6 px-6 py-1 rounded hover:bg-neutral-800/60 hover:text-neutral-100 transition-colors focus:outline-none focus:bg-neutral-700"
                        >
                          Live Rollespil Gear
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/rollespil/kostumer"
                          className="block -mx-6 px-6 py-1 rounded hover:bg-neutral-800/60 hover:text-neutral-100 transition-colors focus:outline-none focus:bg-neutral-700"
                        >
                          Kostumer
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/rollespil/props"
                          className="block -mx-6 px-6 py-1 rounded hover:bg-neutral-800/60 hover:text-neutral-100 transition-colors focus:outline-none focus:bg-neutral-700"
                        >
                          Props & våben
                        </NavLink>
                      </li>
                    </ul>
                    <div className="mt-auto pt-7">
                      <NavLink
                        to="/rollespil"
                        className="inline-block text-lg font-geist text-neutral-200 hover:text-white underline underline-offset-4"
                      >
                        Se alle
                      </NavLink>
                    </div>
                  </div>
                  <div className="group px-8 py-10 hover:bg-neutral-800/50 transition-all duration-300 flex flex-col">
                    {/* Category Image and Title Group */}
                    <div className="group/title">
                      <NavLink
                        to="/merch"
                        aria-label="Se alle Merch"
                        className="block"
                      >
                        <div className="mb-5 rounded-lg overflow-hidden shadow-lg ring-1 ring-neutral-700/50 group-hover/title:ring-neutral-600 transition-all">
                          <img
                            src={comicsImg}
                            alt="Merch"
                            className="w-full h-36 object-cover group-hover/title:scale-110 transition-transform duration-300"
                          />
                        </div>
                      </NavLink>
                      <NavLink
                        to="/merch"
                        className="flex items-center gap-2 mb-5 font-geist font-bold text-lg tracking-wider hover-underline group-hover/title:text-red-500 transition-colors"
                      >
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
                        MERCH
                      </NavLink>
                    </div>
                    <ul className="space-y-2.5 font-geist text-lg text-neutral-400">
                      <li>
                        <NavLink
                          to="/merch/figurer"
                          className="block -mx-6 px-6 py-1 rounded hover:bg-neutral-800/60 hover:text-neutral-100 transition-colors focus:outline-none focus:bg-neutral-700"
                        >
                          Figurer
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/merch/posters"
                          className="block -mx-6 px-6 py-1 rounded hover:bg-neutral-800/60 hover:text-neutral-100 transition-colors focus:outline-none focus:bg-neutral-700"
                        >
                          Posters
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/merch/t-shirts"
                          className="block -mx-6 px-6 py-1 rounded hover:bg-neutral-800/60 hover:text-neutral-100 transition-colors focus:outline-none focus:bg-neutral-700"
                        >
                          T-shirts
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/merch/collectibles"
                          className="block -mx-6 px-6 py-1 rounded hover:bg-neutral-800/60 hover:text-neutral-100 transition-colors focus:outline-none focus:bg-neutral-700"
                        >
                          Collectibles
                        </NavLink>
                      </li>
                    </ul>
                    <div className="mt-auto pt-7">
                      <NavLink
                        to="/merch"
                        className="inline-block text-lg font-geist text-neutral-200 hover:text-white underline underline-offset-4"
                      >
                        Se alle
                      </NavLink>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* KLUB FARAOS */}
          <NavLink
            to="/klub-faraos"
            className="px-6 py-3 font-geist font-bold text-lg hover-underline"
          >
            KLUB FARAOS
          </NavLink>

          {/* User Icon */}
          <NavLink to="/account" className="p-3 hover-underline">
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

          {/* Shopping Cart Icon */}
          <NavLink to="/cart" className="p-3 hover-underline">
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

export default OldNavbar;
