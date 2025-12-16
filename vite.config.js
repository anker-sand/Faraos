import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: '/Faraos/',
  plugins: [react(), tailwindcss()],
  safelist: [
    "bg-neutral-950",
    "bg-neutral-900",
    "text-neutral-100",
    "grid-cols-2",
    "md:grid-cols-3",
    "lg:grid-cols-4",
    "gap-6",
    "hover:bg-neutral-800",
    "transition-all",
    "ring-neutral-800",
    "shadow-[0_12px_48px_-12px_rgba(0,0,0,0.65)]",
    "animate-slide-down",
    "animate-expand-left",
    "hover-underline",
    "group/title",
    "no-scrollbar",
    "f-checkbox",
    "cat-btn-active",
    "cat-btn-base",
  ],
});
