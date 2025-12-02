import React, { useRef, useState, useEffect, useCallback } from "react";

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

  const PEEK = 56;
  const GAP = 28; // slightly larger space between cards

  const stateRef = useRef({ dragging: false, programmatic: false });
  const animRef = useRef({ active: false, cancel: () => {} });
  const bandWidthRef = useRef(0);

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
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
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
        setCenterRawIndex((prev) => {
          let raw = nearest;
          if (
            !stateRef.current.dragging &&
            !stateRef.current.programmatic &&
            originalLength
          ) {
            const bandW =
              bandWidthRef.current || originalLength * (cardWidth + GAP);
            if (raw < originalLength) {
              raw += originalLength;
              vp.scrollLeft += bandW;
            } else if (raw >= originalLength * 2) {
              raw -= originalLength;
              vp.scrollLeft -= bandW;
            }
          }
          return raw;
        });
      });
    };
    vp.addEventListener("scroll", onScroll, { passive: true });
    return () => vp.removeEventListener("scroll", onScroll);
  }, [originalLength, ready, cardWidth]);

  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    let startX = 0;
    let startScroll = 0;
    const onPointerDown = (e) => {
      stateRef.current.dragging = true;
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
      if (!stateRef.current.dragging) return;
      const dx = e.clientX - startX;
      vp.scrollLeft = startScroll - dx;
    };
    const endDrag = (e) => {
      if (!stateRef.current.dragging) return;
      vp.releasePointerCapture(e.pointerId);
      stateRef.current.dragging = false;
      vp.style.scrollBehavior = "";
      snapToNearest();
    };
    vp.addEventListener("pointerdown", onPointerDown);
    vp.addEventListener("pointermove", onPointerMove);
    vp.addEventListener("pointerup", endDrag);
    vp.addEventListener("pointerleave", endDrag);
    return () => {
      vp.removeEventListener("pointerdown", onPointerDown);
      vp.removeEventListener("pointermove", onPointerMove);
      vp.removeEventListener("pointerup", endDrag);
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

  const handleCardClick = (rawIdx) => {
    if (rawIdx === centerRawIndex) {
      if (typeof onItemClick === "function" && originalLength) {
        onItemClick(
          items[centerRawIndex % originalLength],
          centerRawIndex % originalLength
        );
      }
      return;
    }
    centerSmoothTo(rawIdx);
  };

  const goPrev = () => centerSmoothTo(centerRawIndex - 1);
  const goNext = () => centerSmoothTo(centerRawIndex + 1);

  return (
    <div className="w-full relative select-none">
      <div
        ref={viewportRef}
        className="w-full overflow-x-scroll overflow-y-visible no-scrollbar py-4"
        style={{ paddingLeft: PEEK, paddingRight: PEEK }}
      >
        <div ref={trackRef} className="flex items-stretch" style={{ gap: GAP }}>
          {extended.map((item, idx) => {
            const isCenter = idx === centerRawIndex;
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
                  cursor: "pointer",
                }}
                onClick={() => handleCardClick(idx)}
              >
                <div
                  className={
                    "rounded-lg bg-neutral-900 ring-1 ring-neutral-800 overflow-hidden transition-transform duration-300 relative group/card " +
                    (isCenter
                      ? "shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_12px_34px_-10px_rgba(0,0,0,0.65)] hover:scale-105"
                      : "shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_4px_18px_-6px_rgba(0,0,0,0.55)]")
                  }
                >
                  {isCenter && (
                    <div className="absolute top-3 left-3 z-10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                      <span className="inline-block px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-neutral-950 font-geist font-bold text-xs uppercase tracking-wide rounded shadow-lg">
                        New Release
                      </span>
                    </div>
                  )}
                  <div className="relative aspect-[3/4] bg-neutral-800">
                    <img
                      draggable="false"
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    {!isCenter && (
                      <div className="absolute inset-0 bg-black/35" />
                    )}
                    {isCenter && (
                      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_60%)]" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Current item title and controls */}
      <div className="mt-8 flex flex-col items-center gap-4">
        <h3 className="font-geist font-bold text-2xl text-white whitespace-nowrap">
          {originalLength
            ? items[centerRawIndex % originalLength]?.title || ""
            : ""}
        </h3>
        <button className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-geist font-semibold text-sm rounded-lg transition-colors shadow-lg hover:shadow-xl whitespace-nowrap">
          Se mere
        </button>
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
