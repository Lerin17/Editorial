"use client";
import Svg from "../../import/SvgText";
import React, { useState } from "react";
import CH1_Stacker from "./CH1_Stacker";
import CH1_Loader from "./CH1_Loader";
import CH1_Loader2 from "./CH1_Loader2";
import CH1_Herot from "./CH1_Herot";
import CH2_page from "../CH2_Location/CH2_page";
export default function CH1_page({ children }: { children?: React.ReactNode }) {
  const [showAlternateText, setShowAlternateText] = useState(false);

  const [loaderCount, setLoaderCount] = useState<number>(0);
  const [isReveal, setisReveal] = React.useState<boolean>(false);
  const [number1, setnumber1] = useState("4");

  React.useEffect(() => {
    if (100 > loaderCount) {
      setTimeout(() => {
        console.log("addd");
        setLoaderCount((prev) => prev + 1);
      }, 10);
    }
  }, [loaderCount]);

  console.log(loaderCount, "loodercount");

  // React.useEffect(() => {

  //   setisReveal(true)
  // }, []);

  return (
    <div
      className={`min-h-screen relative flex  items-center justify-center bg-red-300 ${loaderCount === 100 ? "" : ""} box-border `}
    >
      <CH1_Herot />
      {/* <div className="absolute z-[100] w-full h-full">
    
      </div> */}

      {/* <CH2_page /> */}
      {/* <section
        data-section="CH2"
        className={`${350 >= 320 ? "" : ""} h-screen `}
      >
        <CH2_page />
      </section> */}

      {/* <div className="absolute z-[100] w-full h-full">
        <CH2_page />
      </div> */}

      {/* <CH1_Loader2 /> */}
      {/* <CH1_Loader number1={number1} loaderCount={loaderCount} /> */}
    </div>
  );
}
