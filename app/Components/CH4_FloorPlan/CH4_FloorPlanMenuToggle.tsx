"use client";

import { useCH4FloorPlanContext } from "../../Context/CH4_FloorPlan_Context";

export default function CH4FloorPlanMenuToggle() {
  const { setIsFloorPlanMenuOpen } = useCH4FloorPlanContext();

  return (
    <svg
      onClick={() => {
        setIsFloorPlanMenuOpen((prev) => !prev);
        console.log("clicked");
      }}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="mt-4 w-[47px] h-[47px] p-0 cursor-pointer fill-current text-gray-600 hover:opacity-80 transition-opacity duration-300"
    >
      <path d="m22 17.75c0-.414-.336-.75-.75-.75h-13.5c-.414 0-.75.336-.75.75s.336.75.75.75h13.5c.414 0 .75-.336.75-.75zm-18.25-2.75c.966 0 1.75.784 1.75 1.75s-.784 1.75-1.75 1.75-1.75-.784-1.75-1.75.784-1.75 1.75-1.75zm18.25-1.25c0-.414-.336-.75-.75-.75h-13.5c-.414 0-.75.336-.75.75s.336.75.75.75h13.5c.414 0 .75-.336.75-.75zm-18.25-3.75c.966 0 1.75.784 1.75 1.75s-.784 1.75-1.75 1.75-1.75-.784-1.75-1.75.784-1.75 1.75-1.75zm18.25-.25c0-.414-.336-.75-.75-.75h-13.5c-.414 0-.75.336-.75.75s.336.75.75.75h13.5c.414 0 .75-.336.75-.75zm-18.25-4.75c.966 0 1.75.784 1.75 1.75s-.784 1.75-1.75 1.75-1.75-.784-1.75-1.75.784-1.75 1.75-1.75zm18.25.75c0-.414-.336-.75-.75-.75h-13.5c-.414 0-.75.336-.75.75s.336.75.75.75h13.5c.414 0 .75-.336.75-.75z" />
    </svg>
  );
}
