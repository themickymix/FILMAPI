import React from "react";
function Card3({ img }) {
  return (
    <div className="w-16 ">
      <img
        className="h-16 w-16 p-1  object-cover brightness-90"
        src={img}
        alt={name}
      />
    </div>
  );
}

export default Card3;
