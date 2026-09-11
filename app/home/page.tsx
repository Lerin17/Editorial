"use client";

import React, { useEffect, useRef } from "react";
import CH1_page from "../Components/CH1_Letter/CH1_page";
import CH2_page from "../Components/CH2_Location/CH2_page";
import CH3_page from "../Components/CH3_SitePlan/CH3_page";
import CH4_page from "../Components/CH4_FloorPlan/CH4_page";
import CH4Menu_page from "../Components/CH4_FloorPlan/Menu/CH4_Menu_page";
import CH1_Loader2 from "../Components/CH1_Letter/CH1_Loader2";

import { CH4FloorPlanProvider } from "../Context/CH4_FloorPlan_Context";
import { useUtilityContext } from "../Context/Utility";
import CH5_page from "../Components/CH5_IMAX/CH5_page";
import CH6_page from "../Components/CH6_Gallery/CH6_page";

export default function HomePage() {
  const {
    isGalleryDisplayScreenActive,
    currentSection,
    isUnloadLoader,
    setIsUnloadLoader,
  } = useUtilityContext();

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   if (!isUnloadLoader) return;
  //   const timer = setTimeout(() => {
  //     scrollContainerRef.current?.scrollBy({
  //       top: window.innerHeight / 3.1,
  //       behavior: "smooth",
  //     });
  //   }, 500);
  //   return () => clearTimeout(timer);
  // }, [isUnloadLoader]);

  return (
    <CH4FloorPlanProvider>
      {!isUnloadLoader && (
        <div className=" relative bg-red-500">
          <div className="absolute z-200 w-full h-full">
            <CH1_Loader2 />
          </div>
        </div>
      )}

      <div
        ref={scrollContainerRef}
        className="h-screen snap-y snap-proximity overflow-y-scroll"
      >
        {!isGalleryDisplayScreenActive && (
          <section data-section="CH6" className="h-screen snap-start">
            <CH6_page />
          </section>
        )}

        {isGalleryDisplayScreenActive && (
          <>

          <section className="relative h-full snap-start">
           <section data-section="CH1" className="absolute top-0 left-0 w-full h-full z-10">
              <CH1_page />
            </section>

            {/* <section data-section="CH1" className="h-screen snap-start ">
              <CH1_page />
            </section> */}

            <section data-section="CH2" className="absolute top-0 left-0 w-full h-full z-0">
              <CH2_page />
            </section>
          </section>
           

            <section
              data-section="CH3"
              className="h-screen snap-start bg-blue-400"
            >
              <CH3_page />
            </section>

            <section
              data-section="CH4"
              className="h-screen snap-start bg-red-400"
            >
              <CH4_page />
            </section>

            <section data-section="CH5" className="h-screen snap-start ">
              <CH5_page />
            </section>

            <section data-section="CH6" className="h-screen snap-start ">
              <CH6_page />
            </section>
          </>
        )}

        <CH4Menu_page />
      </div>
    </CH4FloorPlanProvider>
  );
}
