import React from "react";

const FilterSidebar = ({
  formats = [],
  genres = [],
  languages = [],
  active = {},
  onToggle,
  onShowMoreGenres,
}) => {
  const Section = ({ title, children }) => (
    <div className="space-y-2">
      <h3 className="font-geist font-bold text-sm uppercase tracking-wide text-neutral-300 px-2">
        {title}
      </h3>
      {children}
    </div>
  );

  const Checkbox = ({ id, label, checked, onChange }) => (
    <label className="flex items-center gap-3 text-sm font-geist text-neutral-300">
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
    <aside className="rounded-xl bg-neutral-900/95 backdrop-blur-sm ring-1 ring-neutral-800 p-6 sticky top-28 space-y-6">
      <Section title="Format">
        <div className="space-y-2">
          {formats.map((fmt) => (
            <Checkbox
              key={fmt}
              id={`format-${fmt}`}
              label={fmt}
              checked={active.formats?.has(fmt)}
              onChange={() => onToggle("formats", fmt)}
            />
          ))}
        </div>
      </Section>

      <div className="h-px bg-neutral-800/80" />

      <Section title="Genre">
        <div className="space-y-2">
          {genres
            .slice(0, active.showAllGenres ? genres.length : 5)
            .map((g) => (
              <Checkbox
                key={g}
                id={`genre-${g}`}
                label={g}
                checked={active.genres?.has(g)}
                onChange={() => onToggle("genres", g)}
              />
            ))}
        </div>
        {genres.length > 5 && (
          <button
            type="button"
            onClick={onShowMoreGenres}
            className="mt-2 text-xs bg-neutral-800 hover:bg-neutral-700 rounded-md px-3 py-1 ring-1 ring-neutral-700/70"
          >
            {active.showAllGenres ? "Vis færre" : "Vis flere genre"}
          </button>
        )}
      </Section>

      <div className="h-px bg-neutral-800/80" />

      <Section title="Sprog">
        <div className="space-y-2">
          {languages.map((lng) => (
            <Checkbox
              key={lng}
              id={`lang-${lng}`}
              label={lng}
              checked={active.languages?.has(lng)}
              onChange={() => onToggle("languages", lng)}
            />
          ))}
        </div>
      </Section>

      <div className="h-px bg-neutral-800/80" />
      <div>
        <button
          type="button"
          className="text-xs bg-neutral-800 hover:bg-neutral-700 rounded-md px-3 py-1 ring-1 ring-neutral-700/70"
        >
          + Flere filtre
        </button>
      </div>
    </aside>
  );
};

export default FilterSidebar;
