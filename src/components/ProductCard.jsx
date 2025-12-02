import React from "react";
import { NavLink } from "react-router";

const ProductCard = ({
  image,
  title,
  author,
  price,
  stock = "På lager",
  link = "#",
}) => {
  return (
    <div className="group bg-neutral-900/80 border border-neutral-800 rounded-xl overflow-hidden hover:border-neutral-700 hover:bg-neutral-900 transition-all duration-300 shadow-md hover:shadow-lg">
      {/* Product Image */}
      <div className="relative aspect-[2.8/4] overflow-hidden bg-neutral-800">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Stock Badge */}
        <div className="absolute top-2 right-2">
          <span className="px-1.5 py-0.5 bg-green-600 text-white text-[10px] font-geist font-bold rounded">
            {stock}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-geist font-bold text-sm mb-1.5 line-clamp-2 group-hover:text-neutral-300 transition-colors">
          {title}
        </h3>
        <p className="text-neutral-400 text-xs mb-3 font-geist">{author}</p>

        <div className="flex items-center justify-between">
          <span className="font-geist font-bold text-base">DKK {price}</span>
          <NavLink
            to={link}
            className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-md font-geist text-xs font-bold transition-colors"
          >
            Se mere
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
