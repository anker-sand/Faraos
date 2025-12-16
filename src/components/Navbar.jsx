import React, { useRef, useState } from "react";
import { NavLink, useLocation } from "react-router";
import logoSrc from "../assets/img/Faraoswhitelogo.png";
import comicsImg from "../assets/img/nav/comicsimg.jpg";
import rollespilImg from "../assets/img/nav/rollespil.jpg";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [openCategory, setOpenCategory] = useState(null);
  const [dropdownLeft, setDropdownLeft] = useState(0);
  const [dropdownWidth, setDropdownWidth] = useState(undefined);
  const navRef = useRef(null);
  const location = useLocation();
  const isHome = location.pathname === "/";

  const categories = [
    {
      name: "COMICS",
      path: "/comics",
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
      subcategories: [
        { name: "Live Rollespil Gear", path: "/rollespil/gear" },
        { name: "Kostumer", path: "/rollespil/kostumer" },
        { name: "Props & våben", path: "/rollespil/props" },
      ],
    },
    {
      name: "MERCH",
      path: "/merch",
      subcategories: [
        { name: "Figurer", path: "/merch/figurer" },
        { name: "Posters", path: "/merch/posters" },
        { name: "T-shirts", path: "/merch/t-shirts" },
        { name: "Collectibles", path: "/merch/collectibles" },
      ],
    },
  ];

  return (
    <nav
      id="global-navbar"
      ref={navRef}
      className={styles.nav}
      onMouseLeave={() => setOpenCategory(null)}
    >
      <div className={styles.container}>
        <NavLink to="/" aria-label="Go to home">
          <img src={logoSrc} alt="Faraos Logo" className={styles.logo} />
        </NavLink>

        <div className={styles.navLinks}>
          {categories.map((category) => (
            <div
              key={category.name}
              className={styles.group}
              onMouseEnter={(e) => {
                setOpenCategory(category.name);
                const linkEl = e.currentTarget.querySelector("a");
                const navEl = navRef.current;
                if (linkEl && navEl) {
                  const linkRect = linkEl.getBoundingClientRect();
                  const navRect = navEl.getBoundingClientRect();
                  const MIN_PANEL_WIDTH = 280;
                  const panelWidth = Math.max(linkRect.width, MIN_PANEL_WIDTH);
                  setDropdownWidth(panelWidth);
                  const linkCenter = linkRect.left + linkRect.width / 2;
                  const centeredLeft =
                    linkCenter - panelWidth / 2 - navRect.left;
                  setDropdownLeft(centeredLeft);
                }
              }}
            >
              <NavLink
                to={category.name === "COMICS" ? "/" : category.path}
                className={`${styles.buttonCategory} ${styles.cubeLink} ${
                  isHome && category.name === "COMICS" ? styles.cubeActive : ""
                }`}
              >
                {category.name}
              </NavLink>
            </div>
          ))}

          <NavLink
            to="/klub-faraos"
            className={`${styles.linkPrimary} ${styles.cubeLink}`}
          >
            KLUB FARAOS
          </NavLink>

          <NavLink to="/account" className={styles.linkIcon}>
            <svg
              className={styles.icon}
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

          <NavLink to="/cart" className={styles.linkIcon}>
            <svg
              className={styles.icon}
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

      {openCategory && (
        <div
          className={styles.dropdownContainer}
          style={{ left: dropdownLeft, width: dropdownWidth }}
          onMouseEnter={() => setOpenCategory(openCategory)}
        >
          <div className={styles.panel}>
            <div className={styles.panelInner}>
              <div className={styles.imageWrapper}>
                <img
                  src={
                    openCategory === "COMICS"
                      ? comicsImg
                      : openCategory === "ROLLESPIL"
                      ? rollespilImg
                      : comicsImg
                  }
                  alt={openCategory}
                  className={styles.image}
                />
              </div>
              <div className={`${styles.title} ${styles.hoverUnderline}`}>
                <svg
                  className={styles.icon}
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
                {openCategory}
              </div>
              <ul className={styles.sublist}>
                {(
                  categories.find((c) => c.name === openCategory)
                    ?.subcategories || []
                ).map((sub) => (
                  <li key={sub.path}>
                    <NavLink
                      to={sub.path}
                      className={styles.sublink}
                      onClick={() => setOpenCategory(null)}
                    >
                      {sub.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
              <div className={styles.seeAll}>
                <NavLink
                  to={
                    categories.find((c) => c.name === openCategory)?.path || "/"
                  }
                  className={styles.seeAllLink}
                  onClick={() => setOpenCategory(null)}
                >
                  Se alle
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
