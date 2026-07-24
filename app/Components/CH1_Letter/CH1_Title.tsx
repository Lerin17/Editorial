import React from "react";
import Lottie from "lottie-react";

import animationData from "../../../public/lottie/TITLE.json";

function CH1_Title() {
  const [isPlay, setisPlay] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setisPlay(true);
    }, 2000);
  }, []);

  return (
    <div>
      {isPlay && <Lottie animationData={animationData} loop autoPlay />}
    </div>
  );
}

export default CH1_Title;
