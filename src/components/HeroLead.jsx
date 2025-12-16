import React from "react";
import { NavLink } from "react-router";

const HeroLead = () => {
  return (
    <section className="w-full py-12 bg-faraos-bg">
      <div className="mx-auto max-w-[1680px] px-8">
        <div className="relative overflow-hidden rounded-2xl bg-neutral-900/70 backdrop-blur-sm ring-1 ring-neutral-800 shadow-[0_12px_48px_-12px_rgba(0,0,0,0.65)]">
          <div className="absolute inset-0 bg-gradient-to-br from-red-950/15 via-transparent to-blue-950/15" />
          <div className="relative grid grid-cols-1 md:grid-cols-12 gap-8 p-8 md:p-12 items-center">
            <div className="md:col-span-8 lg:col-span-9">
              <h2 className="font-geist text-4xl md:text-5xl font-bold tracking-tight mb-3">
                Find dine næste favoritter
              </h2>
              <p className="text-neutral-300 leading-relaxed text-xl md:text-2xl max-w-4xl">
                Hos faraos har vi alt i tegneserier, graphic novels, manga og
                meget mere! Find inspiration på denne side eller søg og filtrer
                i hele vores udvalg.
              </p>
            </div>
            <div className="md:col-span-4 lg:col-span-3 flex md:items-center md:justify-end">
              <NavLink
                to="/comics"
                className="relative inline-flex items-center justify-center gap-2 px-7 md:px-9 py-4 md:py-5 rounded-2xl text-white text-lg md:text-xl font-semibold transition-all bg-gradient-to-r from-red-600 via-rose-600 to-orange-500 shadow-[0_18px_52px_-16px_rgba(244,63,94,0.75)] ring-1 ring-white/15 hover:brightness-105 hover:scale-[1.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/50"
                aria-label="Se alle comics"
              >
                Se alle comics
                <span className="opacity-90" aria-hidden>
                  →
                </span>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroLead;
