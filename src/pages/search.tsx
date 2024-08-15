import React, { useState, useEffect } from "react";

const CircleDesaturate = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  return (
    <div className="relative h-screen w-full flex items-center justify-center ">
      <div className="bg-black w-[50%] h-full abslute top-0  backdrop-blur-lg opacity-20 border-r-2 border-"></div>
      <div className="grainy-bg absolute inset-0 z-[-1]"></div>
      <div className="relative p-10 bg-white bg-opacity-75 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold">Your Content Here</h1>
      </div>
    </div>
  );
};

export default CircleDesaturate;
