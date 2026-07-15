"use client";

import React, { useEffect } from "react";
import { useCH4FloorPlanContext } from "../../../Context/CH4_FloorPlan_Context";

const CH4Menu_page = () => {
  const { isFloorPlanMenuOpen, setIsFloorPlanMenuOpen } =
    useCH4FloorPlanContext();

  useEffect(() => {
    if (!isFloorPlanMenuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const previousOverflowY = document.body.style.overflowY;

    document.body.style.overflow = "hidden";
    document.body.style.overflowY = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.overflowY = previousOverflowY;
    };
  }, [isFloorPlanMenuOpen]);

  if (!isFloorPlanMenuOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-xl">
      <div className="relative flex h-[100vh] w-[100vw] flex-col overflow-hidden  border border-white/20 bg-white/90 p-8 shadow-2xl">
        <button
          type="button"
          className="absolute right-4 top-4 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-black hover:text-white"
          onClick={() => setIsFloorPlanMenuOpen(false)}
        >
          Close
        </button>

        <div className="mt-10 flex h-full flex-col px-4">
          <h2 className="mt-3 text-3xl font-semibold text-black sm:text-4xl underline decoration-blue-500 decoration-1 underline-offset-32">
            The Vale Wumba
          </h2>

          <ol className="mt-6  space-y-4 text-lg text-black font-archivo">
            <li>
              {" "}
              <span>*</span>4 Bedroom Semi-Detached Floor Plan
            </li>

            <li>
              {" "}
              <span>*</span>3 Bedroom Terraced Floor Plan
            </li>

            <li>
              <span>*</span>3 and 1 Bedroom Mixed Building Floor Plan
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default CH4Menu_page;
