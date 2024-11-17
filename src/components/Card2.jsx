import React from 'react'
function Card2({ name, img, knownFor }) {
  return (
    <div className="w-16 border border-purple-600 rounded-full">
      <img
        className="h-16 w-16 p-1 object-cover  rounded-full brightness-90"
        src={img}
        alt={name}
      />
      <h3 className="text-sm ">{name}</h3>
      <p className="text-xs text-gray-400">{knownFor}</p>
    </div>
  );
}

export default Card2;
