# Faraos – AI Coding Agent Guide

Concise, actionable patterns for this React + Vite + Tailwind app so agents can be productive immediately.

## Tech & Tooling

- React 19; React Router 7 imported from `react-router` (not `react-router-dom`).
- Vite 7 with SWC Fast Refresh via `@vitejs/plugin-react-swc`.
- Tailwind CSS v4 via Vite plugin (`@tailwindcss/vite`); no `tailwind.config.js`.
- ESLint 9 flat config in `eslint.config.js` with a custom unused-vars rule.

## Build & Dev Workflows

- `npm run dev`: start Vite dev server.
- `npm run build`: compile to `dist/`.
- `npm run preview`: serve the production build.
- `npm run lint`: run ESLint; unused UPPERCASE vars are permitted by `varsIgnorePattern`.
- React Compiler is incompatible with SWC here (see README note).

## Architecture & Routing

- Entry: `src/main.jsx` mounts `App` and imports `index.css`.
- Root: `src/App.jsx` sets `<BrowserRouter>` and central `<Routes>`.
- Current routes: `/`, `/daredevil`, `/comics`; `Navbar.jsx` links additional paths like `/games`, `/miniatures`, `/rollespil`, `/merch`, `/klub-faraos`, `/account`, `/cart` (create pages under `src/pages/` before enabling).
- Use `<NavLink>` from `react-router` for navigation and active styling.

## Styling & UX Conventions

- Tailwind utilities are primary; dark theme baseline: `bg-neutral-950`, surfaces `neutral-900`, text `neutral-100`.
- Custom CSS utilities in `src/index.css`:
  - `animate-slide-down`, `animate-expand-left` for menu/search animations.
  - `hover-underline` with pseudo-element for link underline on hover.
  - `group/title` used for nested hover underline effects.
  - Custom scrollbar styles and helpers: `no-scrollbar`.
  - Form UI helpers: `f-checkbox`, button helpers: `cat-btn-base`, `cat-btn-active`.

## Component Patterns

- Default export components: `export default ComponentName`.
- Arrow function components; import `React` explicitly.
- Props are destructured; keep local state in hooks.
- Examples:
  - `Navbar.jsx`: hover-driven mega-menu, expanding search input inside absolutely positioned container to avoid layout shift; menu grid uses `group` hover patterns.
  - `Home.jsx`: fixed hero `Slider` occupying `h-[70vh]` with scrollable content below; sections use ring/shadow to create surface separation; `NewsCarousel` and `CategoryCard` grids use responsive `grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6`.

## Assets & Imports

- Images live under `src/assets/img/` with subfolders like `comics/` and `nav/`.
- Prefer module imports: `import asset from "../assets/img/..."`; render with `<img src={asset} alt="..." />`.
- Some demo data in pages references `src/assets/img/...` as string paths; switch to module imports when stabilizing assets.

## ESLint & Rules

- Flat config extends `@eslint/js`, `react-hooks`, and `react-refresh` (Vite).
- Rule: `no-unused-vars` allows ignored names matching `^[A-Z_]` (useful for constants like `DKK`).

## File Highlights

- `src/components/`: `Navbar.jsx`, `Slider.jsx`, `ProductCard.jsx`, `NewsCarousel.jsx`, `CategoryCard.jsx`.
- `src/pages/`: `Home.jsx`, `Daredevil.jsx`, `ComicsStore.jsx`.
- `vite.config.js`: Tailwind + React SWC plugins.
- `eslint.config.js`: flat config and custom rules.

## Practical Examples

- Routing add: in `App.jsx` add `<Route path="/comics" element={<ComicsStore />} />`, then link from `Navbar.jsx` via `<NavLink to="/comics">`.
- Animated menu: use `animate-slide-down` on dropdown containers; pair with absolute positioning and border merging (`border-b-0`, rounded-b) like in `Navbar.jsx`.
- Responsive grids: `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6` as seen in `Home.jsx`.

## Gotchas

- Import from `react-router`; `react-router-dom` will fail in this setup.
- Do not add `tailwind.config.js`; Tailwind v4 is configured via Vite plugin.
- SWC Fast Refresh is enabled; avoid React Compiler.

Feedback welcome: if any part is unclear or missing (e.g., additional routes, cart/API plans), tell me what to refine.
