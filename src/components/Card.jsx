import React from "react";
import { useParams } from "react-router-dom";
function Card({ name, img, date }) {
  return (
    <div className="card mt-5 animate-fade-right animate-ease-out hover:text-purple-500">
      <img
        className="rounded-lg shadow-2xl shadow-black cursor-pointer transition-all duration-300 transform hover:scale-105 "
        src={img}
        alt={name}
      />
      <span className="text-sm text-white hover:text-purple-500 cursor-pointer mt-2 flex gap-5 z-10">
        {date}&nbsp;{name}
      </span>
    </div>
  );
}

export default Card;
