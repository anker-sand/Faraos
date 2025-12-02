import React from "react";
import { NavLink } from "react-router";
import Slider from "../components/slider.jsx";
import NewsCarousel from "../components/NewsCarousel.jsx";
import CategoryCarousel from "../components/CategoryCarousel.jsx";

const Home = () => {
  const slides = [
    {
      id: 1,
      image: "src/assets/img/ddcollection.png",
      title: "DAREDEVIL COLLECTION 1993",
      description: "Den orignale trilogi af Frank Miller",
    },
    {
      id: 2,
      image: "src/assets/img/DragerDaemoner_web_1.jpg",
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
    <div className="bg-neutral-950">
      {/* Fixed Hero Carousel */}
      <div className="fixed top-0 left-0 w-full h-[70vh] z-30">
        <Slider slides={slides} />
      </div>

      {/* Scrollable Content */}
      <div className="relative">
        {/* Transparent spacer - allows clicks through to carousel */}
        <div className="h-[60vh] relative z-0" />

        <section className="w-full pt-10 pb-10 relative z-40 bg-neutral-950 ring-1 ring-neutral-900 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]">
          <div className="px-8 mb-6 flex flex-col items-center text-center">
            <h2 className="text-4xl md:text-5xl font-geist font-bold tracking-tight">
              NYHEDER
            </h2>
            <NavLink
              to="/nyheder"
              className="mt-2 text-sm font-geist text-neutral-300 hover:text-white underline underline-offset-4"
            >
              Se alle nyheder
            </NavLink>
          </div>
          <NewsCarousel
            items={[
              {
                image: "src/assets/img/comics/womanwithoutfear.jpg",
                title: "Daredevil by Chip Zdarsky vol. 6: Doing Time Pt One",
                author: "Chip Zdarsky & Marco Checchetto",
                price: 159,
                stock: "På lager",
              },
              {
                image: "src/assets/img/comics/hildatwig.jpg",
                title: "Hilda And Twig Wake the Ice Man",
                author: "Luke Pearson",
                price: 179,
                stock: "På lager",
              },
              {
                image: "src/assets/img/comics/milesmorales.jpg",
                title: "Saga Vol. 1",
                author: "Brian K. Vaughan & Fiona Staples",
                price: 129,
                stock: "På lager",
              },
              {
                image: "src/assets/img/comics/starwars.jpg",
                title: "Star Wars Legends Old Republic Omnibus vol. 2",
                author: "Benjamin Carre & Alex Sanchez",
                price: 349,
                stock: "Kun få tilbage",
              },
              {
                image: "src/assets/img/comics/shadowcrane.jpg",
                title: "Shadow of the Golden Crane",
                author: "Mike Mignola",
                price: 249,
                stock: "På lager",
              },
              {
                image: "src/assets/img/comics/minorarcana.jpg",
                title: "Spider-Gwen: Ghost-Spider Vol. 1",
                author: "Seanan McGuire",
                price: 149,
                stock: "På lager",
              },
              {
                image: "src/assets/img/comics/graensebyen.jpg",
                title: "Old Man Logan 2: Grænsebyen",
                author: "Jeff Lemire & Andrea Sorrentino",
                price: 168,
                stock: "På lager",
              },
              {
                image: "src/assets/img/comics/alva.jpg",
                title: "Hellboy: Seed of Destruction",
                author: "Mike Mignola",
                price: 169,
                stock: "På lager",
              },
              {
                image: "src/assets/img/comics/superman.jpg",
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
        <section className="w-full pt-8 pb-12 relative z-40 bg-neutral-950 ring-1 ring-neutral-900 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]">
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
                  image: "src/assets/img/comics/womanwithoutfear.jpg",
                },
                {
                  title: "Graphic Novels",
                  image: "src/assets/img/comics/milesmorales.jpg",
                },
                {
                  title: "Manga",
                  image: "src/assets/img/comics/hildatwig.jpg",
                },
                {
                  title: "Fantasy",
                  image: "src/assets/img/comics/starwars.jpg",
                },
                {
                  title: "Sci-Fi",
                  image: "src/assets/img/comics/shadowcrane.jpg",
                },
                {
                  title: "Superheroes",
                  image: "src/assets/img/comics/superman.jpg",
                },
                { title: "Horror", image: "src/assets/img/comics/alva.jpg" },
                {
                  title: "Classics",
                  image: "src/assets/img/comics/graensebyen.jpg",
                },
              ]}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
