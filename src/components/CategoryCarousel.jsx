import React, { useRef, useState, useEffect } from "react";
import { NavLink } from "react-router";

const CategoryCarousel = ({ categories = [] }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.firstChild?.offsetWidth || 200;
    const scrollAmount = direction === "left" ? -cardWidth * 3 : cardWidth * 3;
    el.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <div className="relative w-full">
      <div className="mx-auto max-w-[1680px] px-8 relative">
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-2"
        >
          {categories.map((cat, idx) => (
            <NavLink
              key={idx}
              to={`/${cat.title.toLowerCase().replace(/\s+/g, "-")}`}
              className="group flex-shrink-0 w-[calc((100%-120px)/6)] min-w-[160px] aspect-[19/10] relative rounded-xl overflow-hidden bg-neutral-900 ring-2 ring-neutral-800 hover:ring-red-600/60 transition-all duration-300 hover:scale-[1.03] shadow-lg hover:shadow-2xl"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 brightness-90 contrast-110 group-hover:brightness-100"
                draggable="false"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-red-950/10 via-transparent to-blue-950/10 mix-blend-overlay" />
              <div className="absolute inset-0 flex items-end justify-center p-6 pb-8">
                <h3 className="font-geist font-bold text-xl md:text-2xl text-white text-center tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] leading-tight">
                  {cat.title}
                </h3>
              </div>
            </NavLink>
          ))}
        </div>

        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 md:-translate-x-8 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-neutral-900/90 hover:bg-neutral-800 transition shadow-lg ring-1 ring-neutral-700"
            aria-label="Scroll left"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 md:translate-x-8 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-neutral-900/90 hover:bg-neutral-800 transition shadow-lg ring-1 ring-neutral-700"
            aria-label="Scroll right"
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoryCarousel;
