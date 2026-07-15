"use client";

import React from "react";
import Image from "next/image";
import locationImage from "../../../public/img/site_4.jpg";
import { useUtilityContext } from "../../Context/Utility";

const CH3_page: React.FC = () => {
  const { screenSize } = useUtilityContext();
  const {
    width,
    height,
    screenSizeRatio,
    approximateScreenSizeRatio,
    isSmall,
    isMedium,
    isLarge,
  } = screenSize;

  const frameWidth = isSmall ? "100%" : isMedium ? "90%" : "1080px";
  const frameHeight = isSmall ? "70vh" : isMedium ? "80vh" : "85vh";
  const frameMaxHeight = isSmall ? "420px" : isMedium ? "560px" : "720px";
  const statusText = `${width}×${height} • ${screenSizeRatio.toFixed(2)} • ${approximateScreenSizeRatio} • ${isSmall ? "small" : isMedium ? "medium" : "large"}`;

  return (
    <div
      className="bg-white"
      style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}
    >
      <main className="flex min-h-screen items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden w-full"
          style={{
            width: frameWidth,
            height: frameHeight,
            maxWidth: "1080px",
            maxHeight: frameMaxHeight,
            minWidth: "280px",
            minHeight: "320px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxSizing: "border-box",
          }}
        >
          <Image
            src={locationImage}
            alt="Site plan background"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1080px"
            style={{ objectFit: "contain", objectPosition: "center" }}
            priority
          />
        </div>

        {/* <div className="text-left lg:hidden block mt-4 w-10/12">
          Name: <span className="font-bold">CH3</span>
          <div className="mt-1 text-sm text-gray-600">{statusText}</div>
        </div> */}
      </main>

      {/* <div className="text-center mt-4 w-8/12 flex items-center justify-center mx-auto  ">
        lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </div> */}
    </div>
  );
};

export default CH3_page;
