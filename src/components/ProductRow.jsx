import React, { useRef } from "react";
import ProductCard from "./ProductCard.jsx";

const ProductRow = ({ title, items = [], cols = 5 }) => {
  const viewportRef = useRef(null);
  const scrollBy = (dx) => {
    const vp = viewportRef.current;
    if (!vp) return;
    vp.scrollBy({ left: dx, behavior: "smooth" });
  };

  return (
    <section className="w-full py-10">
      <div className="mx-auto max-w-[1680px] px-8 mb-5">
        <h3 className="text-2xl md:text-3xl font-geist font-bold tracking-wide text-white">
          {title}
        </h3>
      </div>

      <div className="mx-auto max-w-[1680px] px-8 relative">
        {/* Side overlay arrows anchored to container edges */}
        <button
          type="button"
          onClick={() => scrollBy(-640)}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 md:-translate-x-8 z-30 h-[200px] w-12 md:w-14 flex items-center justify-center bg-neutral-900/20 hover:bg-neutral-900/30 text-neutral-300 hover:text-white ring-1 ring-neutral-800/40 backdrop-blur-[2px] rounded-r-lg transition"
          aria-label="Scroll left"
        >
          <svg
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M15 19l-7-7 7-7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => scrollBy(640)}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 md:translate-x-8 z-30 h-[200px] w-12 md:w-14 flex items-center justify-center bg-neutral-900/20 hover:bg-neutral-900/30 text-neutral-300 hover:text-white ring-1 ring-neutral-800/40 backdrop-blur-[2px] rounded-l-lg transition"
          aria-label="Scroll right"
        >
          <svg
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M9 5l7 7-7 7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div ref={viewportRef} className="w-full overflow-x-auto no-scrollbar">
          <div
            className={"grid grid-flow-col gap-6 md:gap-8"}
            style={{
              gridAutoColumns: `minmax(200px, ${(
                100 / Math.max(1, Math.min(cols, items.length || cols))
              ).toFixed(4)}%)`,
            }}
          >
            {items.map((p, i) => (
              <ProductCard key={`${p.title}-${i}`} {...p} />
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1680px] px-8">
        <div className="mt-8 h-px bg-neutral-800" />
      </div>
    </section>
  );
};

export default ProductRow;
