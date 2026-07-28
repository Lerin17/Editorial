"use client";
import Svg from "../../import/SvgText";
import React, { useState } from "react";
import CH1_Stacker from "./CH1_Stacker";
import CH1_Loader from "./CH1_Loader";
export default function CH1_page({ children }: { children?: React.ReactNode }) {
  const [showAlternateText, setShowAlternateText] = useState(false);

  const [loaderCount, setLoaderCount] = useState<number>(0);

  React.useEffect(() => {
    if (loaderCount < 100) {
      setTimeout(() => {
        setLoaderCount((prev) => prev + 1);
      }, 10);
    }
  }, [loaderCount]);

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${loaderCount === 100 ? "" : "p-8 bg-black"} box-border `}
    >
      {/* <CH1_Loader /> */}
      <CH1_Loader loaderCount />
    </div>
  );
}
