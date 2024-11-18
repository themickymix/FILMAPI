import React from "react";
function Card4({ name, img, date, category }) {
  return (
    <div className="card mt-5 animate-fade-right animate-ease-out hover:text-purple-500">
      <img
        className="rounded-lg shadow-2xl shadow-black cursor-pointer transition-all duration-300 transform hover:scale-105 "
        src={img}
        alt={name}
      />
      <span className="text-sm md:text-base text-white hover:text-purple-500 cursor-pointer mt-2 flex gap-5 z-10">
        {name}
      </span>
      <span>
        {date} {category}
      </span>
    </div>
  );
}

export default Card4;
