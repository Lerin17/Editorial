import React from "react";
import Image from "next/image";
import planImage2 from "../../../public/img/plan_3.png";

import { useUtilityContext } from "../../Context/Utility";
import { motion } from "framer-motion";

const CH1_Loader2 = () => {
  const { screenSize, currentSection } = useUtilityContext();
  const frameWidth = "90%";
  const frameHeight = "100vh";

  return (
    <div className="h-screen w-screen bg-white flex items-center overflow-hidden">
      <div
        className="relative overflow-hidden  border border-black"
        style={{
          width: frameWidth,
          height: frameHeight,
          maxWidth: "800px",
          maxHeight: "600px",

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
    </div>
  );
};

export default CH1_Loader2;
