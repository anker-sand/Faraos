import React, { useState, useEffect, useRef } from "react";

const Slider = ({
  slides = [],
  onSlideClick,
  auto = true,
  interval = 6000,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Autoplay progress bar logic
  useEffect(() => {
    if (!auto || slides.length <= 1) {
      setProgress(0);
      return;
    }
    let start = performance.now();
    const step = (now) => {
      const elapsed = now - start;
      const pct = Math.min(elapsed / interval, 1);
      setProgress(pct);
      if (elapsed >= interval) {
        nextSlide();
        start = performance.now();
        setProgress(0);
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlide, auto, interval, slides.length]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") nextSlide();
      else if (e.key === "ArrowLeft") prevSlide();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="relative w-full h-[70vh] overflow-hidden">
      {/* Slides */}
      <div
        className="flex transition-transform duration-600 ease-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className="group min-w-full h-full relative flex items-end cursor-pointer"
            onClick={() => {
              if (typeof onSlideClick === "function") {
                onSlideClick(slide, idx);
              }
            }}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(.25,.6,.3,1)] group-hover:scale-[1.05]"
              draggable="false"
            />
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/55 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/55 to-transparent" />
            </div>
            {/* Content (overlay) */}
            <div className="relative z-10 px-12 pb-20 pt-12 max-w-3xl">
              <h2 className="text-6xl font-geist font-bold mb-4 tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)]">
                {slide.title}
              </h2>
              {slide.description && (
                <p className="text-2xl text-neutral-100 mb-8 max-w-2xl leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
                  {slide.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Navigation bottom-right (raised within visible hero area) */}
      <div className="absolute bottom-16 right-8 z-50 flex gap-3">
        <button
          onClick={prevSlide}
          className="w-11 h-11 flex items-center justify-center rounded-full bg-neutral-900/90 hover:bg-neutral-800 transition shadow ring-1 ring-neutral-700 text-white"
          aria-label="Previous slide"
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
        <button
          onClick={nextSlide}
          className="w-11 h-11 flex items-center justify-center rounded-full bg-neutral-900/90 hover:bg-neutral-800 transition shadow ring-1 ring-neutral-700 text-white"
          aria-label="Next slide"
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
      </div>

      {/* Indicators & Progress */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4">
        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide
                  ? "bg-neutral-100 w-8"
                  : "bg-neutral-600/50 hover:bg-neutral-500 w-3"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        {auto && (
          <div className="w-72 h-2 bg-neutral-700/60 rounded overflow-hidden">
            <div
              className="h-full bg-neutral-200 transition-[width] duration-300"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Slider;
