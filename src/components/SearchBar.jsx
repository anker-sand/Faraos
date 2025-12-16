import React, { useEffect, useMemo, useRef, useState } from "react";

const SearchBar = ({
  products = [],
  filtersIndex = {},
  onApplyFilter,
  onSearch,
}) => {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    onSearch?.(value);
  }, [value, onSearch]);

  const suggestions = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return { filters: [], products: [] };
    const filters = [];
    const add = (type, label, payload) =>
      filters.push({ type, label, payload });
    Object.entries(filtersIndex).forEach(([type, list]) => {
      list.forEach((lbl) => {
        if (lbl.toLowerCase().includes(q)) add(type, lbl, { type, value: lbl });
      });
    });
    const productsMatch = products
      .filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.author || "").toLowerCase().includes(q) ||
          (p.subcategory || "").toLowerCase().includes(q)
      )
      .slice(0, 6);
    return { filters, products: productsMatch };
  }, [value, products, filtersIndex]);

  return (
    <div className="relative w-full">
      <div className="flex w-full items-center gap-3 rounded-xl bg-neutral-900/90 ring-1 ring-neutral-800 p-3">
        <svg
          className="w-5 h-5 text-neutral-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3-3" />
        </svg>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          placeholder="Søg efter titler, forfattere eller filtre..."
          className="flex-1 bg-transparent outline-none text-base md:text-lg placeholder-neutral-500"
        />
        {value && (
          <button
            type="button"
            onClick={() => setValue("")}
            className="text-xs px-2 py-1 rounded bg-neutral-800 ring-1 ring-neutral-700 hover:bg-neutral-750"
          >
            Ryd
          </button>
        )}
      </div>

      {open && (suggestions.filters.length || suggestions.products.length) ? (
        <div className="absolute z-30 mt-2 w-full rounded-xl bg-neutral-900 ring-1 ring-neutral-800 shadow-2xl overflow-hidden">
          {suggestions.filters.length > 0 && (
            <div className="px-3 pt-3">
              <div className="text-xs uppercase tracking-wide text-neutral-400 mb-2">
                Filtre
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestions.filters.slice(0, 12).map((f, i) => (
                  <button
                    key={`${f.type}-${f.label}-${i}`}
                    type="button"
                    className="text-xs bg-neutral-800 hover:bg-neutral-700 rounded-full px-3 py-1 ring-1 ring-neutral-700/70"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      onApplyFilter?.(f.payload);
                      setOpen(false);
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          {suggestions.products.length > 0 && (
            <div className="px-3 py-3 border-t border-neutral-800">
              <div className="text-xs uppercase tracking-wide text-neutral-400 mb-2">
                Titler
              </div>
              <ul className="divide-y divide-neutral-800">
                {suggestions.products.map((p) => (
                  <li
                    key={`sugg-${p.id}`}
                    className="py-2 flex items-center gap-3"
                  >
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{p.title}</div>
                      <div className="text-xs text-neutral-400">{p.author}</div>
                    </div>
                    <div className="text-sm text-neutral-300">
                      {p.price} DKK
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default SearchBar;
