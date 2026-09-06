import React from "react";
import animationData from "../../../../public/lottie/CIRCLE7.json";
import Lottie from "lottie-react";

const LoaderCircle = () => {
  return (
    <div className="w-full h-full">
      <Lottie animationData={animationData} />
    </div>
  );
};

export default LoaderCircle;
