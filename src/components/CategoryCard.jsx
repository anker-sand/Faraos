import React from "react";

const CategoryCard = ({ image, title }) => {
  return (
    <div className="group group/title relative overflow-hidden rounded-xl bg-neutral-900 ring-1 ring-neutral-800 shadow-[0_6px_24px_-8px_rgba(0,0,0,0.6)] transition-colors">
      <div className="relative aspect-[21/9] md:aspect-[21/9]">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover will-change-transform transition-transform duration-500 group-hover:scale-[1.04] group-hover:-translate-y-[1px]"
          draggable="false"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-transparent opacity-95 transition-opacity group-hover:opacity-95" />
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5 group-hover:ring-white/10 transition-colors" />
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-1/2 top-0 h-full w-[120%] bg-[linear-gradient(100deg,transparent,rgba(255,255,255,0.06),transparent)] opacity-0 group-hover:opacity-100 animate-[sheen_1.2s_ease-in-out]" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
          <h3 className="font-geist font-bold text-xl md:text-2xl text-white drop-shadow-lg">
            <span className="px-2 py-1 rounded-md bg-black/30 backdrop-blur-[1px] ring-1 ring-white/10 hover-underline">
              {title}
            </span>
          </h3>
          <div className="flex items-center gap-2 text-neutral-200 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[11px]">Se mere</span>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 text-white transition-colors group-hover:bg-white/15">
              →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
