"use client";

import React from "react";
import Image from "next/image";
import planImage2 from "../../../public/img/plan_3.png";
import { useUtilityContext } from "../../Context/Utility";
import { useCH4FloorPlanContext } from "../../Context/CH4_FloorPlan_Context";
import CH4FloorPlanMenuToggle from "./CH4_FloorPlanMenuToggle";
import CH4Menu_page from "./Menu/CH4_Menu_page";

const CH4_page: React.FC = () => {
  const { screenSize, currentSection } = useUtilityContext();
  const { isFloorPlanMenuOpen, setIsFloorPlanMenuOpen } =
    useCH4FloorPlanContext();
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
  const frameHeight = "100vh";
  const statusText = `${width}×${height} • ${screenSizeRatio.toFixed(2)} • ${approximateScreenSizeRatio} • ${isSmall ? "small" : isMedium ? "medium" : "large"}`;
  const vidSrc = "/vid/WUMBA ANIMATION_MIN.mp4";

  return (
    <div
      // className="bg-white "
      style={{ minHeight: "100vh", backgroundColor: "#552828" }}
    >
      <div className="absolute z-10 left-[65px] top-[95px]">
        {currentSection === "CH4" && <CH4FloorPlanMenuToggle />}
      </div>

      {/* <CH4Menu_page /> */}

      <main
        className={`flex flex-col items-center ${isSmall ? "justify-center" : "justify-center"}  min-h-screen border `}
        // style={{
        //   display: "flex",
        //   justifyContent: "center",
        //   alignItems: "center",
        //   // padding: "40px 24px",
        // }}
      >
        <div
          className="relative overflow-hidden w-full"
          style={{
            width: frameWidth,
            height: frameHeight,
            maxWidth: "1080px",
            maxHeight: "720px",

            minWidth: "320px",
            minHeight: "420px",

            position: "relative",
            overflow: "hidden",
          }}
        >
          <Image
            src={planImage2}
            alt="Floor plan background"
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            priority
          />
        </div>
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

export default CH4_page;
