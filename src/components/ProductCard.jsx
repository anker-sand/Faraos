import React, { useState } from "react";
import { NavLink } from "react-router";

const ProductCard = ({ image, title, author, price, link = "#" }) => {
  const [fav, setFav] = useState(false);
  return (
    <div className="group bg-neutral-900/80 border border-neutral-800 rounded-xl overflow-hidden hover:border-neutral-700 hover:bg-neutral-900 transition-all duration-300 shadow-md hover:shadow-lg">
      {/* Product Image */}
      <div className="relative aspect-[2.8/4] overflow-hidden bg-neutral-800">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Favorite Heart */}
        <button
          type="button"
          aria-label="Add to favorites"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setFav((v) => !v);
          }}
          className="absolute top-2 right-2 inline-flex items-center justify-center w-9 h-9 rounded-full ring-1 ring-neutral-700/60 bg-neutral-900/60 hover:bg-neutral-800/70 transition-colors cursor-pointer"
          aria-pressed={fav}
        >
          {fav ? (
            <svg
              className="w-6 h-6 text-red-500"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 21.35l-1.45-1.32C7.4 17.36 4 14.28 4 10.5 4 8.01 6.01 6 8.5 6c1.54 0 3.04.74 3.99 1.97C13.44 6.74 14.94 6 16.48 6 18.97 6 21 8.01 21 10.5c0 3.78-3.4 6.86-6.55 9.54L12 21.35z" />
            </svg>
          ) : (
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

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-geist font-bold text-lg md:text-xl mb-2 line-clamp-2 group-hover:text-neutral-300 transition-colors">
          {title}
        </h3>
        <p className="text-neutral-400 text-sm md:text-base mb-4 font-geist">
          {author}
        </p>

        <div className="flex items-center justify-between">
          <span className="font-geist font-bold text-lg md:text-xl">
            DKK {price}
          </span>
          <NavLink
            to={link}
            className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-md font-geist text-sm font-bold transition-colors"
          >
            Se mere
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
