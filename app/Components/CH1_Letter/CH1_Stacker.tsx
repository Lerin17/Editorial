import React from "react";
import CH1_Title from "./CH1_Title";

// const red = (
//   <svg
//     width="100%"
//     height="100%"
//     viewBox="0 0 8000 4500"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <defs>
//       <mask id="hero-mask" maskUnits="userSpaceOnUse">
//         {/* White = visible */}
//         <rect width="8000" height="4500" fill="white" />

//         {/* Black = cut out */}
//         <g fill="black">
//           <path d="M2641.6,2152.8l-73.6..." />
//           <path d="M2777.6,2108.4l53.2..." />
//           <path d="M3020,2108.4l188.8..." />
//           <path d="M3293.6,2245.6l-48..." />
//           <path d="M3475.6,2248.4l49.2..." />
//           <path d="M3668.8,2108.4l53.2..." />
//           <path d="M3855.2,2108.4l188.8..." />
//           <path d="M4129.6,2243.6l-36..." />
//           <path d="M4563.2,2391.6c..." />
//           <path d="M4691.2,2250.4l..." />
//           <path d="M4992,2246.8l..." />
//           <path d="M5223.2,2248.4l..." />
//         </g>
//       </mask>
//     </defs>

//     <rect
//       width="8000"
//       height="4500"
//       fill="white"
//       mask="url(/svg/svg-text.svg)"
//     />
//   </svg>
// );

// const pathx = (
//   <div className="absolute w-full h-full z-10 inset-0 border-4">
//     <svg
//       width="100%"
//       height="100%"
//       viewBox="0 0 8000 4500"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <defs>
//         <mask id="hero-mask" maskUnits="userSpaceOnUse">
//           {/* White = visible */}
//           <rect width="8000" height="4500" fill="white" />

//           {/* Black = cut out */}
//           <g fill="black">
//             <path d="M2641.6,2152.8l-73.6..." />
//             <path d="M2777.6,2108.4l53.2..." />
//             <path d="M3020,2108.4l188.8..." />
//             <path d="M3293.6,2245.6l-48..." />
//             <path d="M3475.6,2248.4l49.2..." />
//             <path d="M3668.8,2108.4l53.2..." />
//             <path d="M3855.2,2108.4l188.8..." />
//             <path d="M4129.6,2243.6l-36..." />
//             <path d="M4563.2,2391.6c..." />
//             <path d="M4691.2,2250.4l..." />
//             <path d="M4992,2246.8l..." />
//             <path d="M5223.2,2248.4l..." />
//           </g>
//         </mask>
//       </defs>

//       <rect
//         width="8000"
//         height="4500"
//         fill="white"
//         mask="url(/svg/svg-text-3.svg)"
//       />
//     </svg>
//   </div>
// );

const CH1_Stacker = () => {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-white">
      {/* 
        This is now the masked layer. The image will ONLY be visible 
        where the SVG path/text has solid pixels. Everything else reveals 
        the white background assigned to the parent container.
      */}

      <div className="z-10 h-full w-full absolute">
        <CH1_Title />
      </div>

      {/* <div className="flex items-center justify-center h1">
        <div className="text-5xl text-black ">THE VALE WUMBA</div>
      </div> */}

      <div className="w-full h-full absolute z-0">
        <img
          src="https://res.cloudinary.com/dxjys4qpi/image/upload/v1757757697/Lerin%27s%20Portfolio/Client%204%20%28Apo%20Drive%29/MIN/LIGHT_1_lo7lte_tbthzk.avif"
          alt="Revealed Portfolio Content"
          className="h-full w-full object-cover grayscale"
        />
      </div>

      {/* <div
        className="absolute  inset-0 z-0 w-full h-full"
        style={{
          WebkitMaskImage: "url('/svg/svg-text.svg')",
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          WebkitMaskSize: "cover",

          maskImage: "url('/svg/svg-text.svg')",
          maskRepeat: "no-repeat",
          maskPosition: "center",
          maskSize: "cover",
        }}
      >
        <img
          src="https://res.cloudinary.com/dxjys4qpi/image/upload/v1757757697/Lerin%27s%20Portfolio/Client%204%20%28Apo%20Drive%29/MIN/LIGHT_1_lo7lte_tbthzk.avif"
          alt="Revealed Portfolio Content"
          className="h-full w-full object-cover grayscale"
        />
      </div> */}
    </div>
  );
};

export default CH1_Stacker;
