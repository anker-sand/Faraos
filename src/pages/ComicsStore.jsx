import React, { useMemo, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
// Image module imports ensure Vite handles optimization & hashing
import imgWomanWithoutFear from "../assets/img/comics/womanwithoutfear.jpg";
import imgMilesMorales from "../assets/img/comics/milesmorales.jpg";
import imgHildaTwig from "../assets/img/comics/hildatwig.jpg";
import imgStarWars from "../assets/img/comics/starwars.jpg";
import imgShadowCrane from "../assets/img/comics/shadowcrane.jpg";
import imgSuperman from "../assets/img/comics/superman.jpg";
import imgAlva from "../assets/img/comics/alva.jpg";
import imgGraensebyen from "../assets/img/comics/graensebyen.jpg";

const allProducts = [
  {
    id: 1,
    image: imgWomanWithoutFear,
    title: "Daredevil by Chip Zdarsky vol. 6",
    price: 159,
    author: "Chip Zdarsky",
    category: "US comics",
    subcategory: "Daredevil",
    date: 2022,
  },
  {
    id: 2,
    image: imgMilesMorales,
    title: "Miles Morales: Spider-Man",
    price: 179,
    author: "Cody Ziglar",
    category: "US comics",
    subcategory: "Spider-Man",
    date: 2023,
  },
  {
    id: 3,
    image: imgHildaTwig,
    title: "Hilda And Twig Wake the Ice Man",
    price: 129,
    author: "Luke Pearson",
    category: "DK comics",
    subcategory: "Hilda",
    date: 2020,
  },
  {
    id: 4,
    image: imgStarWars,
    title: "Star Wars Legends Old Republic Omnibus vol. 2",
    price: 349,
    author: "Various",
    category: "US comics",
    subcategory: "Star Wars",
    date: 2024,
  },
  {
    id: 5,
    image: imgShadowCrane,
    title: "Shadow of the Golden Crane",
    price: 189,
    author: "Ken Liu",
    category: "Graphic Novels",
    subcategory: "Fantasy",
    date: 2019,
  },
  {
    id: 6,
    image: imgSuperman,
    title: "Superman Action Comics",
    price: 159,
    author: "Philip Kennedy Johnson",
    category: "US comics",
    subcategory: "Superman",
    date: 2023,
  },
  {
    id: 7,
    image: imgAlva,
    title: "Alva",
    price: 99,
    author: "Josefine Ottesen",
    category: "Bøger",
    subcategory: "DK",
    date: 2018,
  },
  {
    id: 8,
    image: imgGraensebyen,
    title: "Grænsebyen",
    price: 149,
    author: "Rune Ryberg",
    category: "DK comics",
    subcategory: "Indie",
    date: 2021,
  },
];

const categories = {
  "DK comics": ["Tintin", "Asterix", "Disney", "Indie", "Hilda"],
  "US comics": ["Spider-Man", "Batman", "Superman", "Daredevil", "Star Wars"],
  Manga: ["Shonen", "Shojo", "Seinen"],
  "Graphic Novels": ["Fantasy", "Sci-Fi", "Drama"],
  Bøger: ["DK", "Fantasy", "Non-fiction"],
};

const priceRanges = [
  { label: "Under 100", value: "under100", test: (p) => p < 100 },
  { label: "100–199", value: "100_199", test: (p) => p >= 100 && p <= 199 },
  { label: "200–299", value: "200_299", test: (p) => p >= 200 && p <= 299 },
  { label: "300+", value: "300_plus", test: (p) => p >= 300 },
];

const sortOptions = [
  { label: "A → Z", value: "az" },
  { label: "Z → A", value: "za" },
  { label: "Price: Low → High", value: "priceAsc" },
  { label: "Price: High → Low", value: "priceDesc" },
  { label: "Newest", value: "dateDesc" },
  { label: "Oldest", value: "dateAsc" },
];

const ComicsStore = () => {
  const [query, setQuery] = useState("");
  // Single active category for clearer UX (accordion acts as selector)
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubs, setActiveSubs] = useState(new Set());
  const [activePrices, setActivePrices] = useState(new Set());
  const [sort, setSort] = useState("az");

  const toggleSet = (setFn, current, key) => {
    const next = new Set(current);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setFn(next);
  };

  const resetAll = () => {
    setQuery("");
    setActiveCategory(null);
    setActiveSubs(new Set());
    setActivePrices(new Set());
    setSort("az");
    setExpandedCats(new Set());
  };

  const collator = useMemo(
    () => new Intl.Collator(undefined, { sensitivity: "base" }),
    []
  );

  const filtered = useMemo(() => {
    let list = [...allProducts];

    // text search across title/author/subcategory
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.author || "").toLowerCase().includes(q) ||
          (p.subcategory || "").toLowerCase().includes(q)
      );
    }

    // category filter (single)
    if (activeCategory) {
      list = list.filter((p) => p.category === activeCategory);
    }

    // subcategory filter
    if (activeSubs.size) {
      list = list.filter((p) => activeSubs.has(p.subcategory));
    }

    // price filter
    if (activePrices.size) {
      list = list.filter((p) => {
        for (const r of priceRanges) {
          if (activePrices.has(r.value) && r.test(p.price)) return true;
        }
        return false;
      });
    }

    // sort
    switch (sort) {
      case "az":
        list.sort((a, b) => collator.compare(a.title, b.title));
        break;
      case "za":
        list.sort((a, b) => collator.compare(b.title, a.title));
        break;
      case "priceAsc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "dateDesc":
        list.sort((a, b) => (b.date || 0) - (a.date || 0));
        break;
      case "dateAsc":
        list.sort((a, b) => (a.date || 0) - (b.date || 0));
        break;
      default:
        break;
    }

    return list;
  }, [query, activeCategory, activeSubs, activePrices, sort, collator]);

  // Category groups collapsed by default; price section collapsed
  const [expandedCats, setExpandedCats] = useState(new Set());
  const [expandPrice, setExpandPrice] = useState(false);

  const toggleCatExpand = (cat) => {
    setExpandedCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Extra top padding to clear the navbar */}
      <div className="mx-auto max-w-[1680px] px-4 md:px-6 pt-49 pb-24">
        {/* Page Title placed above the grid so sidebar aligns below */}
        <div className="mb-4 md:mb-6">
          <h1 className="text-3xl md:text-6xl font-geist font-bold">COMICS</h1>
          <h2 className="text-2xl py-6 text-neutral-400 max-w-4xl">
            Filtrer eller søg i vores store udvalg af tegneserier, graphic
            novels og manga bøger. <br />
            Læser du på engelsk eller dansk? Faraos har noget for enhver smag!
          </h2>
        </div>

        {/* Controls bar: results on left, sorting on right */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 md:mb-6">
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <span>Resultater:</span>
            <span className="font-geist font-bold text-neutral-200">
              {filtered.length}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-neutral-900/70 ring-1 ring-neutral-800 rounded-md px-2 py-1.5">
            <label className="text-sm text-neutral-300">Sortér</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-9 px-3 rounded bg-neutral-900 ring-1 ring-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active filter chips under controls (hidden if none) */}
        {query || activeCategory || activeSubs.size || activePrices.size ? (
          <div className="mb-8 flex flex-wrap gap-2">
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-xs bg-neutral-800 hover:bg-neutral-700 rounded-full px-3 py-1 flex items-center gap-1 ring-1 ring-neutral-700/70"
              >
                <span>Søg: {query}</span>{" "}
                <span className="text-neutral-400">✕</span>
              </button>
            )}
            {activeCategory && (
              <button
                type="button"
                onClick={() => setActiveCategory(null)}
                className="text-xs bg-neutral-800 hover:bg-neutral-700 rounded-full px-3 py-1 flex items-center gap-1 ring-1 ring-neutral-700/70"
              >
                <span>{activeCategory}</span>{" "}
                <span className="text-neutral-400">✕</span>
              </button>
            )}
            {[...activeSubs].map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => toggleSet(setActiveSubs, activeSubs, s)}
                className="text-xs bg-neutral-800 hover:bg-neutral-700 rounded-full px-3 py-1 flex items-center gap-1 ring-1 ring-neutral-700/70"
              >
                <span>{s}</span> <span className="text-neutral-400">✕</span>
              </button>
            ))}
            {[...activePrices].map((p) => {
              const label = priceRanges.find((r) => r.value === p)?.label || p;
              return (
                <button
                  type="button"
                  key={p}
                  onClick={() => toggleSet(setActivePrices, activePrices, p)}
                  className="text-xs bg-neutral-800 hover:bg-neutral-700 rounded-full px-3 py-1 flex items-center gap-1 ring-1 ring-neutral-700/70"
                >
                  <span>{label}</span>{" "}
                  <span className="text-neutral-400">✕</span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={resetAll}
              className="text-xs bg-red-600 hover:bg-red-500 rounded-full px-3 py-1 font-geist font-bold shadow-[0_0_0_1px_rgba(0,0,0,0.2)]"
            >
              Ryd alle
            </button>
          </div>
        ) : null}

        {/* Main grid with sidebar and products starts below header/controls */}
        <div className="grid lg:grid-cols-[320px_1fr] gap-8 xl:gap-10 items-start">
          {/* Sidebar */}
          <aside className="rounded-xl bg-neutral-900/95 backdrop-blur-sm ring-1 ring-neutral-800 p-6 sticky top-28 space-y-6">
            <div className="flex items-center gap-2 mb-5">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Søg i filtre..."
                className="font-geist w-full h-11 px-4 rounded-lg bg-neutral-800/80 text-sm placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-600 transition"
              />
              <button
                onClick={resetAll}
                className="h-11 px-4 rounded-lg bg-neutral-800/80 text-xs font-geist font-bold ring-1 ring-neutral-700 hover:bg-neutral-750 tracking-wide"
              >
                Reset
              </button>
            </div>

            {/* Category groups (accordion + selection) */}
            <div className="mt-1">
              <h2 className="font-geist font-bold text-sm uppercase tracking-wide text-neutral-300 px-2 mb-2">
                Kategorier
              </h2>
              <div className="space-y-3">
                {Object.entries(categories).map(([cat, subs]) => {
                  const isExpanded = expandedCats.has(cat);
                  const isActive = activeCategory === cat;
                  return (
                    <div
                      key={cat}
                      className="border border-neutral-800 rounded-lg overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setActiveCategory((prev) => {
                            if (prev === cat) {
                              setActiveSubs(new Set());
                              return null;
                            }
                            return cat;
                          });
                          setExpandedCats((prev) => {
                            const next = new Set(prev);
                            next.add(cat);
                            return next;
                          });
                          setActiveSubs((prev) => {
                            const allowed = new Set(subs);
                            return new Set(
                              [...prev].filter((s) => allowed.has(s))
                            );
                          });
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 font-geist text-[15px] transition-colors ${
                          isActive
                            ? "bg-neutral-850 text-neutral-100"
                            : "text-neutral-300 hover:bg-neutral-850"
                        }`}
                        aria-expanded={isExpanded}
                        aria-controls={`subs-${cat.replace(/\s+/g, "-")}`}
                      >
                        <span className="flex items-center gap-2 tracking-wide">
                          {cat}
                          <span
                            className={`w-2.5 h-2.5 rounded-full ml-1 ${
                              isActive ? "bg-green-500" : "bg-neutral-600"
                            }`}
                          ></span>
                        </span>
                        <span className="text-xs text-neutral-500">
                          {isExpanded ? "▾" : "▸"}
                        </span>
                      </button>
                      {isExpanded && (
                        <div
                          id={`subs-${cat.replace(/\s+/g, "-")}`}
                          className="bg-neutral-900/70 px-4 pt-3 pb-4 space-y-1"
                          role="group"
                          aria-label={`Underkategorier for ${cat}`}
                        >
                          {subs.map((s) => (
                            <label
                              key={s}
                              className="flex items-center gap-2 text-xs font-geist text-neutral-300"
                            >
                              <input
                                type="checkbox"
                                checked={activeSubs.has(s)}
                                onChange={() =>
                                  toggleSet(setActiveSubs, activeSubs, s)
                                }
                                disabled={
                                  activeCategory && activeCategory !== cat
                                }
                                className="f-checkbox"
                              />
                              <span>{s}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="h-px bg-neutral-800/80 my-2" />
            {/* Price ranges (expandable) */}
            <div className="mt-4">
              <button
                type="button"
                className="w-full flex items-center justify-between text-left py-2.5 px-2 rounded hover:bg-neutral-850"
                onClick={() => setExpandPrice((v) => !v)}
                aria-expanded={expandPrice}
                aria-controls="price-ranges"
              >
                <span className="font-geist font-bold text-sm uppercase tracking-wide text-neutral-300">
                  Pris
                </span>
                <span className="text-neutral-400 text-xs">
                  {expandPrice ? "▾" : "▸"}
                </span>
              </button>
              {expandPrice && (
                <div
                  id="price-ranges"
                  className="pt-2 space-y-2"
                  role="group"
                  aria-label="Priskategorier"
                >
                  {priceRanges.map((r) => (
                    <label
                      key={r.value}
                      className="flex items-center gap-3 text-sm font-geist text-neutral-300"
                    >
                      <input
                        type="checkbox"
                        checked={activePrices.has(r.value)}
                        onChange={() =>
                          toggleSet(setActivePrices, activePrices, r.value)
                        }
                        className="f-checkbox"
                      />
                      <span>{r.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </aside>

          {/* Content */}
          <section className="flex-1">
            {/* Product grid */}
            {filtered.length === 0 ? (
              <div className="text-center py-16 rounded-lg bg-neutral-900/60 ring-1 ring-neutral-800">
                <div className="text-2xl font-geist font-bold mb-2">
                  Ingen resultater
                </div>
                <div className="text-sm text-neutral-400">
                  Prøv at justere dine filtre eller ryd alle.
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={resetAll}
                    className="text-sm bg-neutral-800 hover:bg-neutral-700 rounded-md px-4 py-2 ring-1 ring-neutral-700/70"
                  >
                    Ryd alle filtre
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 md:gap-8">
                {filtered.map((p) => (
                  <ProductCard
                    key={p.id}
                    image={p.image}
                    title={p.title}
                    author={p.author}
                    price={p.price}
                    stock={"På lager"}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default ComicsStore;
