import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./ComicsStore.module.css";
import ProductCard from "../components/ProductCard.jsx";
import SearchBar from "../components/SearchBar.jsx";
import FiltersPanel from "../components/FiltersPanel.jsx";
import { db } from "../lib/firebase.js";
import { collection, onSnapshot } from "firebase/firestore";
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
    publisher: "Marvel",
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
    publisher: "Marvel",
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
    publisher: "Flying Eye Books",
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
    publisher: "Dark Horse",
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
    publisher: "Saga Press",
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
    publisher: "DC",
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
    publisher: "Gyldendal",
    category: "Bøger",
    subcategory: "DK",
    date: 2018,
  },
  {
    id: 8,
    image: imgGraensebyen,
    title: "Grænsebyen",
    price: 249,
    author: "Carsten Søndergaard",
    publisher: "Cobolt",
    category: "DK comics",
    subcategory: "Tintin",
    date: 2021,
  },
];

const sortOptions = [
  { value: "dateDesc", label: "Nyeste" },
  { value: "dateAsc", label: "Ældste" },
  { value: "az", label: "A → Z" },
  { value: "za", label: "Z → A" },
  { value: "priceAsc", label: "Pris: Lav til høj" },
  { value: "priceDesc", label: "Pris: Høj til lav" },
];

const priceRanges = [
  { value: "under100", label: "Under 100 kr" },
  { value: "100to199", label: "100–199 kr" },
  { value: "200to299", label: "200–299 kr" },
  { value: "300plus", label: "300+ kr" },
];

const ComicsStore = () => {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("dateDesc");
  // Start empty so hardcoded items are hidden; Firestore fills in.
  const [products, setProducts] = useState([]);

  // Filter states
  const [formats, setFormats] = useState(new Set());
  const [genres, setGenres] = useState(new Set());
  const [languages, setLanguages] = useState(new Set());
  const [activePrices, setActivePrices] = useState(new Set());
  const [authors, setAuthors] = useState(new Set());
  const [publishers, setPublishers] = useState(new Set());
  const [series, setSeries] = useState(new Set());

  // Category helpers used by tags
  const [activeCategory, setActiveCategory] = useState("");
  // Deprecated: use `series` instead of `activeSubs`
  const [activeSubs, setActiveSubs] = useState(new Set());

  // Sidebar open states: Sprog open by default
  const [open, setOpen] = useState({
    language: true,
    format: false,
    genre: false,
    price: false,
    author: false,
    publisher: false,
    series: false,
  });
  const [showAllGenres, setShowAllGenres] = useState(false);

  // Tag row toggle under search
  // Tag row no longer toggles; always show full set
  const tagsScrollRef = useRef(null);

  const scrollTags = (dir) => {
    const el = tagsScrollRef.current;
    if (!el) return;
    const delta = 480; // scroll amount per click
    el.scrollBy({ left: dir === "left" ? -delta : delta, behavior: "smooth" });
  };

  const toggleSet = (setter, set, val) => {
    const next = new Set(set);
    if (next.has(val)) next.delete(val);
    else next.add(val);
    setter(next);
  };

  const resetAll = () => {
    setQuery("");
    setSort("dateDesc");
    setFormats(new Set());
    setGenres(new Set());
    setLanguages(new Set());
    setActivePrices(new Set());
    setActiveCategory("");
    setActiveSubs(new Set());
    setAuthors(new Set());
    setPublishers(new Set());
    setSeries(new Set());
  };

  const collator = useMemo(() => new Intl.Collator("da"), []);

  // Load products from Firestore (fallback to local seed if collection empty)
  useEffect(() => {
    const colRef = collection(db, "Comics");
    const unsub = onSnapshot(
      colRef,
      (snap) => {
        const docs = snap.docs.map((d) => {
          const data = d.data() || {};
          const title = (data["Titel"] ?? data.titel ?? data.title) || "";
          const author =
            (data["Forfatter"] ?? data.forfatter ?? data.author) || "";
          const publisher = data["Publisher"] ?? data.publisher ?? "";
          const format = data["Format"] ?? data.format ?? "";
          const language = data["Sprog"] ?? data.sprog ?? "";
          const priceRaw = data["Pris"] ?? data.pris ?? data.price;
          const yearRaw =
            data["Udgivelsesår"] ??
            data.udgivelsesår ??
            data.date ??
            data.releaseYear;
          const volume = data["Volume"] ?? data.volume;
          const series = (data["series"] ?? data.Series ?? "")
            .toString()
            .trim();
          const image = (
            data["Billede"] ??
            data.billede ??
            data.image ??
            ""
          ).toString();

          // Derive category using language and format to fit existing UI filters
          let category = undefined;
          if (format === "Graphic Novel") category = "Graphic Novels";
          else if (language === "Dansk") category = "DK comics";
          else if (language) category = "US comics";

          return {
            id: d.id,
            image,
            title: title.toString().trim(),
            price:
              typeof priceRaw === "number" ? priceRaw : Number(priceRaw) || 0,
            author: author.toString().trim(),
            publisher: publisher.toString().trim(),
            category,
            subcategory: series || undefined,
            date:
              typeof yearRaw === "number"
                ? yearRaw
                : parseInt((yearRaw || "").toString().trim(), 10) || 0,
            volume:
              typeof volume === "number" ? volume : Number(volume) || undefined,
            format,
            language,
            isActive: data.isActive ?? true,
            stockCount: data.stockCount ?? 0,
          };
        });
        setProducts(docs);
        console.debug("Comics snapshot:", docs.length);
      },
      (e) => {
        console.error("Firestore listener failed:", e);
      }
    );
    return () => unsub();
  }, []);

  // Build option lists for new filters
  const authorOptions = useMemo(
    () => Array.from(new Set(products.map((p) => p.author).filter(Boolean))),
    [products]
  );
  const publisherOptions = useMemo(
    () => Array.from(new Set(products.map((p) => p.publisher).filter(Boolean))),
    [products]
  );
  const seriesOptions = useMemo(
    () =>
      Array.from(new Set(products.map((p) => p.subcategory).filter(Boolean))),
    [products]
  );

  const filtered = useMemo(() => {
    let list = products.slice();
    const q = query.trim().toLowerCase();

    if (q) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.author || "").toLowerCase().includes(q) ||
          (p.category || "").toLowerCase().includes(q) ||
          (p.subcategory || "").toLowerCase().includes(q)
      );
    }

    if (activeCategory) {
      list = list.filter((p) => (p.category || "") === activeCategory);
    }

    // Format filter
    if (formats.size) {
      list = list.filter((p) => formats.has(p.format));
    }

    // Series filter (by subcategory)
    if (series.size) {
      list = list.filter((p) => series.has(p.subcategory));
    }

    if (genres.size) {
      const gset = new Set(Array.from(genres).map((g) => g.toLowerCase()));
      list = list.filter((p) => {
        const sub = (p.subcategory || "").toLowerCase();
        return (
          gset.has(sub) ||
          (gset.has("superhero") &&
            ["daredevil", "batman", "spider-man", "superman"].some((s) =>
              sub.includes(s)
            ))
        );
      });
    }

    // Author filter
    if (authors.size) {
      list = list.filter((p) => authors.has(p.author));
    }

    // Publisher filter
    if (publishers.size) {
      list = list.filter((p) => publishers.has(p.publisher));
    }

    // Price filter
    if (activePrices.size) {
      list = list.filter((p) => {
        const price = p.price || 0;
        if (activePrices.has("under100") && price < 100) return true;
        if (activePrices.has("100to199") && price >= 100 && price <= 199)
          return true;
        if (activePrices.has("200to299") && price >= 200 && price <= 299)
          return true;
        if (activePrices.has("300plus") && price >= 300) return true;
        return false;
      });
    }

    return list;
  }, [
    products,
    query,
    activeCategory,
    activePrices,
    formats,
    genres,
    authors,
    publishers,
    series,
    sort,
    collator,
  ]);

  const selectedFilters = useMemo(() => {
    const chips = [];
    if (activeCategory)
      chips.push({
        type: "Kategori",
        typeKey: "category",
        value: activeCategory,
        label: `Kategori: ${activeCategory}`,
      });
    formats.forEach((v) =>
      chips.push({
        type: "Format",
        typeKey: "formats",
        value: v,
        label: `Format: ${v}`,
      })
    );
    genres.forEach((v) =>
      chips.push({
        type: "Genre",
        typeKey: "genres",
        value: v,
        label: `Genre: ${v}`,
      })
    );
    languages.forEach((v) =>
      chips.push({
        type: "Sprog",
        typeKey: "languages",
        value: v,
        label: `Sprog: ${v}`,
      })
    );
    authors.forEach((v) =>
      chips.push({
        type: "Forfatter",
        typeKey: "authors",
        value: v,
        label: `Forfatter: ${v}`,
      })
    );
    publishers.forEach((v) =>
      chips.push({
        type: "Forlag",
        typeKey: "publishers",
        value: v,
        label: `Forlag: ${v}`,
      })
    );
    series.forEach((v) =>
      chips.push({
        type: "Serier",
        typeKey: "series",
        value: v,
        label: `Serier: ${v}`,
      })
    );
    const priceLabel = (val) =>
      priceRanges.find((r) => r.value === val)?.label || val;
    activePrices.forEach((v) =>
      chips.push({
        type: "Pris",
        typeKey: "price",
        value: v,
        label: `Pris: ${priceLabel(v)}`,
      })
    );
    return chips;
  }, [
    activeCategory,
    formats,
    genres,
    languages,
    authors,
    publishers,
    series,
    activePrices,
  ]);

  const removeFilter = (typeKey, value) => {
    if (typeKey === "category") {
      setActiveCategory("");
      return;
    }
    if (typeKey === "price") {
      const next = new Set(activePrices);
      next.delete(value);
      setActivePrices(next);
      return;
    }
    const map = {
      formats: [formats, setFormats],
      genres: [genres, setGenres],
      languages: [languages, setLanguages],
      authors: [authors, setAuthors],
      publishers: [publishers, setPublishers],
      series: [series, setSeries],
    };
    const pair = map[typeKey];
    if (!pair) return;
    const [set, setter] = pair;
    const next = new Set(set);
    next.delete(value);
    setter(next);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Comics</h1>
          <div className={styles.searchWrap}>
            <SearchBar
              products={products}
              filtersIndex={{
                Format: [
                  "Tegneserie (hæfte)",
                  "Graphic Novel",
                  "Manga",
                  "Omnibus / Samlebind",
                  "Hardcover",
                  "Paperback",
                ],
                Genre: [
                  "Superhero",
                  "Sci-Fi",
                  "Horror",
                  "Fantasy",
                  "Dark and gritty",
                ],
                Sprog: ["Dansk", "Engelsk", "Japansk"],
              }}
              onApplyFilter={({ type, value }) => {
                const map = {
                  Format: [formats, setFormats],
                  Genre: [genres, setGenres],
                  Sprog: [languages, setLanguages],
                };
                const pair = map[type];
                if (pair) {
                  const [set, setter] = pair;
                  const next = new Set(set);
                  next.add(value);
                  setter(next);
                }
              }}
              onSearch={setQuery}
            />
          </div>
        </div>

        {/* Tags under search, centered and width-matched to search */}
        <div className={styles.tagsWrap}>
          <span className={styles.tagsLabel}></span>
          {/* Scrollable tag rail with arrows positioned within the rail container */}
          <div className={styles.tagsRelative}>
            <button
              type="button"
              aria-label="Scroll tags left"
              onClick={() => scrollTags("left")}
              className={`${styles.tagBtn} ${styles.tagBtnLeft}`}
            >
              <svg
                className={styles.tagIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Scroll tags right"
              onClick={() => scrollTags("right")}
              className={`${styles.tagBtn} ${styles.tagBtnRight}`}
            >
              <svg
                className={styles.tagIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
            <div className={styles.tagsRailPad}>
              <div ref={tagsScrollRef} className={styles.tagsRail}>
                {[
                  "Tegneserie",
                  "Manga",
                  "Daredevil",
                  "Tintin",
                  "Asterix og Obelix",
                  "Batman",
                  "Star Wars",
                  "Superhero",
                  "Graphic Novels",
                  "Spider-Man",
                  "Superman",
                  "Fantasy",
                  "Sci-Fi",
                ].map((label) => (
                  <button
                    key={`tag-${label}`}
                    type="button"
                    onClick={() => {
                      if (label === "Tegneserie") {
                        toggleSet(setFormats, formats, "Tegneserie (hæfte)");
                        setOpen((o) => ({ ...o, format: true }));
                      } else if (
                        [
                          "Graphic Novel",
                          "Manga",
                          "Omnibus / Samlebind",
                          "Hardcover",
                          "Paperback",
                        ].includes(label)
                      ) {
                        toggleSet(setFormats, formats, label);
                        setOpen((o) => ({ ...o, format: true }));
                      } else if (
                        ["Superhero", "Sci-Fi", "Fantasy", "Horror"].includes(
                          label
                        )
                      ) {
                        toggleSet(setGenres, genres, label);
                        setOpen((o) => ({ ...o, genre: true }));
                      } else if (
                        [
                          "Tintin",
                          "Asterix og Obelix",
                          "Batman",
                          "Daredevil",
                          "Spider-Man",
                          "Superman",
                          "Star Wars",
                        ].includes(label)
                      ) {
                        toggleSet(setSeries, series, label);
                        setOpen((o) => ({ ...o, series: true }));
                      } else {
                        setQuery((q) => (q === label ? "" : label));
                      }
                    }}
                    className={styles.tagPill}
                    data-active={(() => {
                      return (
                        (label === "Tegneserie" &&
                          formats.has("Tegneserie (hæfte)")) ||
                        formats.has(label) ||
                        genres.has(label) ||
                        series.has(label) ||
                        query === label
                      );
                    })()}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results left, Sort right; aligned with products column */}
        <div className={styles.resultsGridRow}>
          <div className={styles.resultsSpacer} />
          <div className={styles.resultsInner}>
            <div className={styles.resultsCountLabel}>
              <span>Resultater:</span>
              <span className={styles.resultsCountValue}>
                {filtered.length}
              </span>
            </div>
            <div className={styles.selectedFilters}>
              {selectedFilters.map((chip) => (
                <span
                  key={`${chip.type}-${chip.value}`}
                  className={styles.filterChip}
                >
                  {chip.label}
                  <button
                    type="button"
                    aria-label={`Remove ${chip.label}`}
                    className={styles.chipRemoveBtn}
                    onClick={() => removeFilter(chip.typeKey, chip.value)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className={styles.sortBox}>
              <label className={styles.sortLabel}>Sortér</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className={styles.sortSelect}
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Main grid: sidebar left, products right */}
        <div className={styles.mainGridRow}>
          {/* Sidebar */}
          <div className={styles.sidebarCol}>
            <FiltersPanel
              formats={[
                "Tegneserie (hæfte)",
                "Graphic Novel",
                "Manga",
                "Omnibus / Samlebind",
                "Hardcover",
                "Paperback",
              ]}
              genres={[
                "Superhero",
                "Sci-Fi",
                "Horror",
                "Fantasy",
                "Dark and gritty",
                "Mystery",
                "Adventure",
              ]}
              authors={authorOptions}
              publishers={publisherOptions}
              series={seriesOptions}
              languages={["Dansk", "Engelsk", "Japansk"]}
              priceRanges={priceRanges}
              state={{
                formats,
                genres,
                languages,
                authors,
                publishers,
                series,
                showAllGenres,
                activePrices,
                open,
                setOpen,
              }}
              onToggle={(type, val) => {
                const map = {
                  formats: [formats, setFormats],
                  genres: [genres, setGenres],
                  languages: [languages, setLanguages],
                  authors: [authors, setAuthors],
                  publishers: [publishers, setPublishers],
                  series: [series, setSeries],
                };
                const [set, setter] = map[type];
                const next = new Set(set);
                if (next.has(val)) next.delete(val);
                else next.add(val);
                setter(next);
              }}
              onTogglePrice={(val) =>
                toggleSet(setActivePrices, activePrices, val)
              }
              onShowMoreGenres={() => setShowAllGenres((v) => !v)}
              onReset={resetAll}
            />
          </div>

          {/* Products */}
          <section className={styles.productsSection}>
            {filtered.length === 0 ? (
              <div className={styles.emptyBox}>
                <div className={styles.emptyTitle}>Ingen resultater</div>
                <div className={styles.emptyText}>
                  Ingen produkter i databasen endnu. Tilføj en vare i Firestore,
                  eller justér dine filtre.
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={resetAll}
                    className={styles.emptyBtn}
                  >
                    Ryd alle filtre
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.gridProducts}>
                {filtered.map((p) => (
                  <ProductCard
                    key={p.id}
                    image={p.image || null}
                    title={p.title}
                    author={p.author}
                    price={p.price}
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
