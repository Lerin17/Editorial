"use client";
import Svg from "../../import/SvgText";
import React, { useState } from "react";
import CH1_Stacker from "./CH1_Stacker";
import CH1_Loader from "./CH1_Loader";
import CH1_Loader2 from "./CH1_Loader2";
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
      className={`min-h-screen flex items-center justify-center ${loaderCount === 100 ? "" : ""} box-border `}
    >
      <CH1_Loader2 />
      {/* <CH1_Loader number1={number1} loaderCount={loaderCount} /> */}
    </div>
  );
}
