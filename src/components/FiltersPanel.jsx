import React from "react";

const FiltersPanel = ({
  formats = [],
  genres = [],
  authors = [],
  publishers = [],
  series = [],
  languages = [],
  priceRanges = [],
  state,
  onToggle,
  onTogglePrice,
  onShowMoreGenres,
  onReset,
}) => {
  const Section = ({ title, open, onToggleOpen, children }) => (
    <div className="rounded-xl bg-neutral-900/80 ring-1 ring-neutral-800 overflow-hidden">
      <button
        type="button"
        onClick={onToggleOpen}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-neutral-850"
        aria-expanded={open}
      >
        <span className="font-geist font-bold text-base md:text-lg uppercase tracking-wide text-neutral-200">
          {title}
        </span>
        <span className="text-neutral-300">
          <svg
            className={`w-5 h-5 md:w-6 md:h-6 transition-transform duration-200 ${
              open ? "rotate-90" : "rotate-0"
            }`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </span>
      </button>
      {open && <div className="px-4 pb-4 pt-2 space-y-2">{children}</div>}
    </div>
  );

  const Checkbox = ({ label, checked, onChange }) => (
    <label className="flex items-center gap-3 px-1.5 py-1.5 rounded hover:bg-neutral-850 text-base md:text-[1rem] text-neutral-300">
      <input
        type="checkbox"
        className="f-checkbox"
        checked={checked}
        onChange={onChange}
      />
      <span>{label}</span>
    </label>
  );

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="text-base md:text-lg text-neutral-300 font-geist">
          Filtrér dit udvalg
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs bg-neutral-800 hover:bg-neutral-700 rounded-md px-3 py-1 ring-1 ring-neutral-700/70"
        >
          Ryd alle
        </button>
      </div>
      <div className="space-y-4">
        <Section
          title="Sprog"
          open={state.open.language}
          onToggleOpen={() =>
            state.setOpen((o) => ({ ...o, language: !o.language }))
          }
        >
          <div className="flex flex-col gap-2">
            {languages.map((lng) => (
              <Checkbox
                key={lng}
                label={lng}
                checked={state.languages.has(lng)}
                onChange={() => onToggle("languages", lng)}
              />
            ))}
          </div>
        </Section>

        <Section
          title="Format"
          open={state.open.format}
          onToggleOpen={() =>
            state.setOpen((o) => ({ ...o, format: !o.format }))
          }
        >
          <div className="flex flex-col gap-2">
            {formats.map((fmt) => (
              <Checkbox
                key={fmt}
                label={fmt}
                checked={state.formats.has(fmt)}
                onChange={() => onToggle("formats", fmt)}
              />
            ))}
          </div>
        </Section>

        <Section
          title="Genre"
          open={state.open.genre}
          onToggleOpen={() => state.setOpen((o) => ({ ...o, genre: !o.genre }))}
        >
          <div className="flex flex-col gap-2">
            {(state.showAllGenres ? genres : genres.slice(0, 6)).map((g) => (
              <Checkbox
                key={g}
                label={g}
                checked={state.genres.has(g)}
                onChange={() => onToggle("genres", g)}
              />
            ))}
          </div>
          {genres.length > 6 && (
            <button
              type="button"
              onClick={onShowMoreGenres}
              className="mt-2 text-xs bg-neutral-800 hover:bg-neutral-700 rounded-md px-3 py-1 ring-1 ring-neutral-700/70"
            >
              {state.showAllGenres ? "Vis færre" : "Vis flere genre"}
            </button>
          )}
        </Section>

        <Section
          title="Forfatter"
          open={state.open.author}
          onToggleOpen={() =>
            state.setOpen((o) => ({ ...o, author: !o.author }))
          }
        >
          <div className="flex flex-col gap-2">
            {authors.map((a) => (
              <Checkbox
                key={a}
                label={a}
                checked={state.authors.has(a)}
                onChange={() => onToggle("authors", a)}
              />
            ))}
          </div>
        </Section>

        <Section
          title="Forlag"
          open={state.open.publisher}
          onToggleOpen={() =>
            state.setOpen((o) => ({ ...o, publisher: !o.publisher }))
          }
        >
          <div className="flex flex-col gap-2">
            {publishers.map((p) => (
              <Checkbox
                key={p}
                label={p}
                checked={state.publishers.has(p)}
                onChange={() => onToggle("publishers", p)}
              />
            ))}
          </div>
        </Section>

        <Section
          title="Serier"
          open={state.open.series}
          onToggleOpen={() =>
            state.setOpen((o) => ({ ...o, series: !o.series }))
          }
        >
          <div className="flex flex-col gap-2">
            {series.map((s) => (
              <Checkbox
                key={s}
                label={s}
                checked={state.series.has(s)}
                onChange={() => onToggle("series", s)}
              />
            ))}
          </div>
        </Section>

        <Section
          title="Pris"
          open={state.open.price}
          onToggleOpen={() => state.setOpen((o) => ({ ...o, price: !o.price }))}
        >
          <div className="flex flex-col gap-2">
            {priceRanges.map((r) => (
              <label
                key={r.value}
                className="inline-flex items-center gap-3 text-base md:text-[1rem] text-neutral-300"
              >
                <input
                  type="checkbox"
                  className="f-checkbox"
                  checked={state.activePrices.has(r.value)}
                  onChange={() => onTogglePrice(r.value)}
                />
                <span>{r.label}</span>
              </label>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
};

export default FiltersPanel;
