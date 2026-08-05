import React from "react";
import animationData from "../../../../public/lottie/CIRCLE3.json";
import Lottie from "lottie-react";

const LoaderCircle = () => {
  return (
    <div className="w-full h-full">
      <Lottie animationData={animationData} loop autoPlay />
    </div>
  );
};

export default LoaderCircle;
