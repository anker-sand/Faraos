import React, { useRef, useState, useEffect, useCallback } from "react";
import { NavLink } from "react-router";

// Scroll-based infinite carousel with manual cancellable smooth scroll to avoid twitching.
const NewsCarousel = ({ items = [], initialIndex = 0, onItemClick }) => {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const originalLength = items.length;
  const extended = originalLength ? [...items, ...items, ...items] : [];
  const initialRaw =
    originalLength +
    Math.min(Math.max(initialIndex, 0), Math.max(originalLength - 1, 0));

  const [cardWidth, setCardWidth] = useState(0);
  const [centerRawIndex, setCenterRawIndex] = useState(initialRaw);
  const [ready, setReady] = useState(false);
  const [activeTab, setActiveTab] = useState("news"); // "popular" | "news" | "bestsellers"
  const [favIndices, setFavIndices] = useState(() => new Set());
  const toggleFavoriteByIndex = (logicalIndex) => {
    setFavIndices((prev) => {
      const next = new Set(prev);
      if (next.has(logicalIndex)) next.delete(logicalIndex);
      else next.add(logicalIndex);
      return next;
    });
  };

  const PEEK = 56;
  const GAP = 28; // slightly larger space between cards

  const stateRef = useRef({ dragging: false, programmatic: false });
  const animRef = useRef({ active: false, cancel: () => {} });
  const bandWidthRef = useRef(0);
  const dragRafRef = useRef(0);
  const lastDxRef = useRef(0);

  const computeLayout = useCallback(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const fullW = vp.clientWidth;
    const cw = Math.max(Math.floor((fullW - 2 * PEEK - 4 * GAP) / 5), 150);
    setCardWidth(cw);
  }, []);

  useEffect(() => {
    computeLayout();
    window.addEventListener("resize", computeLayout);
    return () => window.removeEventListener("resize", computeLayout);
  }, [computeLayout]);

  useEffect(() => {
    if (!originalLength || !cardWidth) return;
    const vp = viewportRef.current;
    const track = trackRef.current;
    if (!vp || !track) return;
    const children = Array.from(track.children);
    // Measure exact band width based on actual rendered children
    if (children.length && originalLength) {
      let sum = 0;
      for (let i = 0; i < originalLength; i++) {
        const el = children[i];
        if (!el) break;
        sum += el.offsetWidth;
        if (i < originalLength - 1) sum += GAP; // inter-card gap
      }
      bandWidthRef.current = sum;
    }
    const target = children[centerRawIndex];
    if (!target) return;
    const vpCenter = vp.clientWidth / 2;
    const targetCenter = target.offsetLeft + target.offsetWidth / 2;
    vp.scrollLeft = targetCenter - vpCenter;
    setReady(true);
  }, [cardWidth, originalLength, centerRawIndex]);

  // Manual scroll animation (cancellable)
  const animateScrollTo = (targetLeft, duration = 320) => {
    const vp = viewportRef.current;
    if (!vp) return;
    if (
      animRef.current.active &&
      typeof animRef.current.cancel === "function"
    ) {
      animRef.current.cancel();
    }
    const startLeft = vp.scrollLeft;
    const startTime = performance.now();
    let cancelled = false;
    stateRef.current.programmatic = true;
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const step = (now) => {
      if (cancelled) return;
      const p = Math.min(1, (now - startTime) / duration);
      vp.scrollLeft = startLeft + (targetLeft - startLeft) * ease(p);
      if (p < 1) {
        requestAnimationFrame(step);
      } else {
        animRef.current.active = false;
        stateRef.current.programmatic = false;
      }
    };
    animRef.current.active = true;
    animRef.current.cancel = () => {
      cancelled = true;
      animRef.current.active = false;
      stateRef.current.programmatic = false;
    };
    requestAnimationFrame(step);
  };

  useEffect(() => {
    const vp = viewportRef.current;
    const track = trackRef.current;
    if (!vp || !track) return;
    let ticking = false;
    const onScroll = () => {
      if (!ready) return;

      // ✅ don’t do expensive work mid-drag
      if (stateRef.current.pointerDown) return;

      let nearest = 0;
      let best = Infinity;
      const children = Array.from(track.children);
      const vpCenter = vp.scrollLeft + vp.clientWidth / 2;
      children.forEach((el, i) => {
        const c = el.offsetLeft + el.offsetWidth / 2;
        const d = Math.abs(c - vpCenter);
        if (d < best) {
          best = d;
          nearest = i;
        }
      });
      setCenterRawIndex(nearest);
    };
    vp.addEventListener("scroll", onScroll, { passive: true });
    return () => vp.removeEventListener("scroll", onScroll);
  }, [originalLength, ready, cardWidth]);

  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;

    let startX = 0;
    let startScroll = 0;

    const DRAG_THRESHOLD = 6; // px
    stateRef.current.dragging = false; // true only after threshold
    stateRef.current.pointerDown = false; // new
    stateRef.current.moved = 0; // new

    const onPointerDown = (e) => {
      // ✅ Do NOT exclude <a>. Only exclude controls that must receive clicks (your fav button etc.)
      const interactive = e.target.closest(
        "button,[role='button'],input,select,textarea,label"
      );
      if (interactive) return;

      e.preventDefault(); // ✅ critical: blocks native drag/selection from <a>

      stateRef.current.pointerDown = true;
      stateRef.current.dragging = false;
      stateRef.current.moved = 0;

      if (
        animRef.current.active &&
        typeof animRef.current.cancel === "function"
      ) {
        animRef.current.cancel();
      }

      vp.setPointerCapture(e.pointerId);
      startX = e.clientX;
      startScroll = vp.scrollLeft;
      vp.style.scrollBehavior = "auto";
    };

    const onPointerMove = (e) => {
      if (!stateRef.current.pointerDown) return;

      const dx = e.clientX - startX;
      const moved = Math.abs(dx);
      stateRef.current.moved = Math.max(stateRef.current.moved, moved);

      // ✅ Only become a “drag” after threshold
      if (
        !stateRef.current.dragging &&
        stateRef.current.moved >= DRAG_THRESHOLD
      ) {
        stateRef.current.dragging = true;
      }
      if (!stateRef.current.dragging) return;

      lastDxRef.current = dx;

      if (dragRafRef.current) return;
      dragRafRef.current = requestAnimationFrame(() => {
        dragRafRef.current = 0;
        vp.scrollLeft = startScroll - lastDxRef.current;
      });
    };

    const endDrag = (e) => {
      if (!stateRef.current.pointerDown) return;

      vp.releasePointerCapture(e.pointerId);
      stateRef.current.pointerDown = false;
      vp.style.scrollBehavior = "";

      if (dragRafRef.current) cancelAnimationFrame(dragRafRef.current);
      dragRafRef.current = 0;

      if (stateRef.current.dragging) {
        stateRef.current.dragging = false;
        snapToNearest();
      }
    };

    vp.addEventListener("pointerdown", onPointerDown);
    vp.addEventListener("pointermove", onPointerMove);
    vp.addEventListener("pointerup", endDrag);
    vp.addEventListener("pointercancel", endDrag);
    vp.addEventListener("pointerleave", endDrag);

    return () => {
      vp.removeEventListener("pointerdown", onPointerDown);
      vp.removeEventListener("pointermove", onPointerMove);
      vp.removeEventListener("pointerup", endDrag);
      vp.removeEventListener("pointercancel", endDrag);
      vp.removeEventListener("pointerleave", endDrag);
    };
  }, []);

  const snapToNearest = () => {
    const vp = viewportRef.current;
    const track = trackRef.current;
    if (!vp || !track) return;
    const children = Array.from(track.children);
    const vpCenter = vp.scrollLeft + vp.clientWidth / 2;
    let nearest = 0;
    let best = Infinity;
    children.forEach((el, i) => {
      const c = el.offsetLeft + el.offsetWidth / 2;
      const d = Math.abs(c - vpCenter);
      if (d < best) {
        best = d;
        nearest = i;
      }
    });
    centerSmoothTo(nearest);
  };

  const centerSmoothTo = (rawIdx) => {
    const vp = viewportRef.current;
    const track = trackRef.current;
    if (!vp || !track) return;
    // Normalize to the middle band while preserving direction continuity
    let normalized = rawIdx;
    if (originalLength) {
      const bandSize =
        bandWidthRef.current || originalLength * (cardWidth + GAP);
      if (normalized < originalLength) {
        // We're trying to move into the left band; shift viewport right by one band
        vp.scrollLeft += bandSize;
        normalized += originalLength;
      } else if (normalized >= originalLength * 2) {
        // We're trying to move into the right band; shift viewport left by one band
        vp.scrollLeft -= bandSize;
        normalized -= originalLength;
      }
    }
    const children = Array.from(track.children);
    const target = children[normalized];
    if (!target) return;
    const vpCenter = vp.clientWidth / 2;
    const targetCenter = target.offsetLeft + target.offsetWidth / 2;
    const targetLeft = targetCenter - vpCenter;
    animateScrollTo(targetLeft);
    setCenterRawIndex(normalized);
  };

  // Click-to-center disabled per request; dragging remains the primary interaction.
  const handleCardClick = null;

  const goPrev = () => centerSmoothTo(centerRawIndex - 1);
  const goNext = () => centerSmoothTo(centerRawIndex + 1);

  return (
    <div className="w-full relative select-none">
      {/* Section headings with 'Se alle' aligned right */}
      <div className="w-full relative mb-10">
        <div className="flex items-center justify-center gap-12">
          <button
            type="button"
            onClick={() => setActiveTab("popular")}
            className={
              "font-geist font-bold text-3xl md:text-4xl tracking-wide transition-colors " +
              (activeTab === "popular"
                ? "text-white"
                : "text-neutral-400 hover:text-neutral-200")
            }
          >
            POPULÆRE NU
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("news")}
            className={
              "font-geist font-bold text-3xl md:text-4xl tracking-wide transition-colors " +
              (activeTab === "news"
                ? "text-white"
                : "text-neutral-400 hover:text-neutral-200")
            }
          >
            NYHEDER
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("bestsellers")}
            className={
              "font-geist font-bold text-3xl md:text-4xl tracking-wide transition-colors " +
              (activeTab === "bestsellers"
                ? "text-white"
                : "text-neutral-400 hover:text-neutral-200")
            }
          >
            BESTSELLERS
          </button>
        </div>
        <div className="absolute right-8 top-1">
          <NavLink
            to={
              activeTab === "popular"
                ? "/populaere"
                : activeTab === "bestsellers"
                ? "/bestsellers"
                : "/nyheder"
            }
            className="text-sm md:text-base font-geist text-neutral-300 hover:text-white hover-underline"
          >
            {activeTab === "popular"
              ? "Se alle populære"
              : activeTab === "bestsellers"
              ? "Se alle bestsellers"
              : "Se alle nyheder"}
          </NavLink>
        </div>
      </div>
      <div
        ref={viewportRef}
        className="w-full overflow-x-scroll overflow-y-visible no-scrollbar py-4"
        style={{ paddingLeft: PEEK, paddingRight: PEEK }}
      >
        <div ref={trackRef} className="flex items-stretch" style={{ gap: GAP }}>
          {extended.map((item, idx) => {
            const isCenter = idx === centerRawIndex;
            const logicalIndex = originalLength ? idx % originalLength : idx;
            const isFav = favIndices.has(logicalIndex);
            const opacity = isCenter ? 1 : 0.58;
            const scale = isCenter ? 1.008 : 1;
            return (
              <div
                key={idx}
                className="relative flex-shrink-0 group/card"
                style={{
                  width: cardWidth || 200,
                  transition:
                    "opacity 220ms, transform 260ms cubic-bezier(.25,.6,.3,1)",
                  opacity,
                  transform: `scale(${scale})`,
                  cursor: "default",
                }}
                // Click disabled: do not center on click
              >
                <div
                  className={
                    "rounded-lg bg-neutral-900 ring-1 ring-neutral-800 overflow-hidden transition-transform duration-300 relative " +
                    (isCenter
                      ? "shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_12px_34px_-10px_rgba(0,0,0,0.65)] hover:scale-105"
                      : "shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_4px_18px_-6px_rgba(0,0,0,0.55)]")
                  }
                >
                  {isCenter && (
                    <NavLink
                      to={item.link || "/"}
                      className="absolute inset-0 z-20 cursor-pointer"
                      aria-label={item.title}
                      draggable={false} // ✅ stops URL/ghost dragging
                      onDragStart={(e) => e.preventDefault()} // ✅ prevents native drag behavior
                      onClickCapture={(e) => {
                        // ✅ If user dragged, do NOT navigate
                        if (stateRef.current.moved >= 6) {
                          e.preventDefault();
                          e.stopPropagation();
                        }
                      }}
                    />
                  )}
                  {isCenter && (
                    <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between opacity-0 group-hover/card:opacity-100 transition-opacity duration-200">
                      <span className="inline-block px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-neutral-950 font-geist font-bold text-xs uppercase tracking-wide rounded shadow-lg">
                        New Release
                      </span>
                      <button
                        type="button"
                        aria-label="Add to favorites"
                        onPointerDown={(e) => e.stopPropagation()} // ✅ prevents starting drag
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavoriteByIndex(logicalIndex);
                        }}
                        className="pointer-events-auto inline-flex items-center justify-center w-8 h-8 rounded-full ring-1 ring-neutral-700/60 bg-neutral-900/60 hover:bg-neutral-800/70 transition-colors relative cursor-pointer"
                        role="button"
                        aria-pressed={isFav}
                      >
                        {isFav ? (
                          // Solid heart (Heroicons solid variant)
                          <svg
                            className="w-6 h-6 text-red-500"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12 21.35l-1.45-1.32C7.4 17.36 4 14.28 4 10.5 4 8.01 6.01 6 8.5 6c1.54 0 3.04.74 3.99 1.97C13.44 6.74 14.94 6 16.48 6 18.97 6 21 8.01 21 10.5c0 3.78-3.4 6.86-6.55 9.54L12 21.35z" />
                          </svg>
                        ) : (
                          // Outline heart
                          <svg
                            className="w-6 h-6 text-neutral-300"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                          >
                            <path d="M12 21.35l-1.45-1.32C7.4 17.36 4 14.28 4 10.5 4 8.01 6.01 6 8.5 6c1.54 0 3.04.74 3.99 1.97C13.44 6.74 14.94 6 16.48 6 18.97 6 21 8.01 21 10.5c0 3.78-3.4 6.86-6.55 9.54L12 21.35z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  )}
                  <div className="relative aspect-[3/4] bg-neutral-800">
                    <img
                      draggable="false"
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Current item title and controls */}
      <div className="mt-8 flex flex-col items-center gap-4">
        <h3 className="font-geist font-bold text-xl text-white whitespace-nowrap">
          {originalLength
            ? items[centerRawIndex % originalLength]?.title || ""
            : ""}
        </h3>
        {/* Se mere button hidden per request */}
        <div className="flex items-center justify-center gap-8 font-geist text-lg">
          <button
            onClick={goPrev}
            className="w-10 h-10 flex items-center justify-center transition hover:text-white text-neutral-400"
            aria-label="Previous"
          >
            <svg
              className="w-8 h-8"
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
          <span className="text-neutral-300 tracking-wide min-w-[80px] text-center text-base font-medium">
            {originalLength
              ? `${(centerRawIndex % originalLength) + 1} / ${originalLength}`
              : "0 / 0"}
          </span>
          <button
            onClick={goNext}
            className="w-10 h-10 flex items-center justify-center transition hover:text-white text-neutral-400"
            aria-label="Next"
          >
            <svg
              className="w-8 h-8"
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
      </div>
    </div>
  );
};

export default NewsCarousel;
