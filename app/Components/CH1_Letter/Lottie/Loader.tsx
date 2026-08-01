import React from "react";
import animationData from "../../../../public/lottie/LOADER2.json";
import Lottie from "lottie-react";

const Loader = () => {
  return (
    <div>
      <Lottie animationData={animationData} loop autoPlay />
    </div>
  );
};

export default Loader;
