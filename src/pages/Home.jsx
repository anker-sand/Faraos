import React from "react";
import { NavLink } from "react-router";
import Slider from "../components/Slider.jsx";
import NewsCarousel from "../components/NewsCarousel.jsx";
import CategoryCarousel from "../components/CategoryCarousel.jsx";

// Import assets so Vite bundles and rewrites URLs
import ddevilRed from "../assets/img/ddevilred.jpg";
import dragerDaemoner from "../assets/img/DragerDaemoner_web_1.jpg";

import womanWithoutFear from "../assets/img/comics/womanwithoutfear.jpg";
import hildaTwig from "../assets/img/comics/hildatwig.jpg";
import milesMorales from "../assets/img/comics/milesmorales.jpg";
import starwars from "../assets/img/comics/starwars.jpg";
import shadowCrane from "../assets/img/comics/shadowcrane.jpg";
import minorArcana from "../assets/img/comics/minorarcana.jpg";
import graensebyen from "../assets/img/comics/graensebyen.jpg";
import alva from "../assets/img/comics/alva.jpg";
import superman from "../assets/img/comics/superman.jpg";

const Home = () => {
  const slides = [
    {
      id: 1,
      image: ddevilRed,
      title: "DAREDEVIL COLLECTION 1993",
      description: "Den orignale trilogi af Frank Miller",
    },
    {
      id: 2,
      image: dragerDaemoner,
      title: "Drager og Dæmoner",
      description: "Game night essentials",
    },
    {
      id: 3,
      image: "https://via.placeholder.com/1920x800/1a1a1a/ffffff?text=Slide+3",
      title: "Warhammer Collection",
      description: "Build your army",
    },
  ];

  return (
    <div className="bg-faraos-bg">
      <section className="w-full h-[70vh] relative -mt-[160px] bg-faraos-bg">
        <Slider slides={slides} />
      </section>

      {/* Scrollable Content */}
      <section className="w-full pt-10 pb-10 bg-faraos-bg ring-1 ring-neutral-900 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]">
        <NewsCarousel
          items={[
            {
              image: womanWithoutFear,
              title: "Daredevil by Chip Zdarsky vol. 6: Doing Time Pt One",
              author: "Chip Zdarsky & Marco Checchetto",
              price: 159,
              stock: "På lager",
            },
            {
              image: hildaTwig,
              title: "Hilda And Twig Wake the Ice Man",
              author: "Luke Pearson",
              price: 179,
              stock: "På lager",
            },
            {
              image: milesMorales,
              title: "Saga Vol. 1",
              author: "Brian K. Vaughan & Fiona Staples",
              price: 129,
              stock: "På lager",
            },
            {
              image: starwars,
              title: "Star Wars Legends Old Republic Omnibus vol. 2",
              author: "Benjamin Carre & Alex Sanchez",
              price: 349,
              stock: "Kun få tilbage",
            },
            {
              image: shadowCrane,
              title: "Shadow of the Golden Crane",
              author: "Mike Mignola",
              price: 249,
              stock: "På lager",
            },
            {
              image: minorArcana,
              title: "Spider-Gwen: Ghost-Spider Vol. 1",
              author: "Seanan McGuire",
              price: 149,
              stock: "På lager",
            },
            {
              image: graensebyen,
              title: "Old Man Logan 2: Grænsebyen",
              author: "Jeff Lemire & Andrea Sorrentino",
              price: 168,
              stock: "På lager",
            },
            {
              image: alva,
              title: "Hellboy: Seed of Destruction",
              author: "Mike Mignola",
              price: 169,
              stock: "På lager",
            },
            {
              image: superman,
              title: "Watchmen (Deluxe Edition)",
              author: "Alan Moore & Dave Gibbons",
              price: 299,
              stock: "Kun få tilbage",
            },
          ]}
          initialIndex={0}
        />
      </section>

      {/* Categories section */}
      <section className="w-full pt-8 pb-12 bg-faraos-bg ring-1 ring-neutral-900 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]">
        <div className="px-8 mb-6 flex flex-col items-center text-center">
          <h2 className="text-4xl md:text-5xl font-geist font-bold tracking-tight">
            KATEGORIER
          </h2>
          <NavLink
            to="/kategorier"
            className="mt-2 text-sm font-geist text-neutral-300 hover:text-white underline underline-offset-4"
          >
            Se alle kategorier
          </NavLink>
        </div>
        <div className="px-8">
          <CategoryCarousel
            categories={[
              {
                title: "Comics",
                image: womanWithoutFear,
              },
              {
                title: "Graphic Novels",
                image: milesMorales,
              },
              {
                title: "Manga",
                image: hildaTwig,
              },
              {
                title: "Fantasy",
                image: starwars,
              },
              {
                title: "Sci-Fi",
                image: shadowCrane,
              },
              {
                title: "Superheroes",
                image: superman,
              },
              { title: "Horror", image: alva },
              {
                title: "Classics",
                image: graensebyen,
              },
            ]}
          />
        </div>
      </section>
    </div>
  );
};

export default Home;
