import React from "react";
// import uce from "../../../public/svg/the-vale-wumba.svg";

const CH1_Stacker = () => {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Reveal Layer */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://res.cloudinary.com/dxjys4qpi/image/upload/v1757757697/Lerin%27s%20Portfolio/Client%204%20%28Apo%20Drive%29/MIN/LIGHT_1_lo7lte_tbthzk.avif"
          alt=""
          className="h-full w-full object-cover"
        />
      </div>

      {/* White overlay masked by the SVG */}
      <div
        className="absolute inset-0 z-10 "
        style={{
          WebkitMaskImage: "url('/svg/the-vale-wumba.svg')",
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          WebkitMaskSize: "cover",

          maskImage: "url('/svg/the-vale-wumba.svg')",
          maskRepeat: "no-repeat",
          maskPosition: "center",
          maskSize: "cover",
        }}
      />
    </div>
  );
};

export default CH1_Stacker;
