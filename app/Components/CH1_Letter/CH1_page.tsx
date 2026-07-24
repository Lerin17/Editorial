"use client";
import Svg from "../../import/SvgText";
import React, { useState } from "react";
import CH1_Stacker from "./CH1_Stacker";
import CH1_Loader from "./CH1_Loader";
export default function CH1_page({ children }: { children?: React.ReactNode }) {
  const [showAlternateText, setShowAlternateText] = useState(false);

  const [tryText, setTryText] = useState(0);

  React.useEffect(() => {
    if (tryText < 100) {
      setTimeout(() => {
        setTryText((prev) => prev + 1);
      }, 100);
    }
  }, [tryText]);

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${tryText === 100 ? "" : "p-8 bg-black"} box-border `}
    >
      {tryText === 100 ? <CH1_Loader /> : <CH1_Stacker />}
      {/* <div className="text-black">{tryText}</div> */}
    </div>
  );
}
