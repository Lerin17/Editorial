import React from "react";
import { useUtilityContext } from "../../Context/Utility/UtilityContext";

const CH1_Herot = () => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const { isOpeningSequence, isUnloadLoader } = useUtilityContext();

  React.useEffect(() => {
    if (isUnloadLoader) {
      const timeout = setTimeout(() => {
        console.log(
          "isUnloadLoader changed:",
          isUnloadLoader,
          videoRef.current,
        );
        videoRef.current?.play().catch((error) => {
          console.error(
            "Error attempting to play video:",
            error,
            videoRef.current,
          );
        });
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isUnloadLoader]);

  return (
    <div className='h-screen w-screen bg-red-400 flex items-center justify-center'>
      {/* 
      {isOpeningSequence && ()} */}

      <div className="inset-0 z-[190] h-full w-full">
        <video
          ref={videoRef}
          src="/vid/input_1.mp4"
          // autoPlay
          muted
          // loop
          playsInline
          preload="auto"

          className="h-full w-full object-cover"
        />
        {/* <button
                    onClick={() => {
                      if (isVideoPlaying) {
                        videoRef.current?.pause();
                      } else {
                        videoRef.current?.play();
                      }
                      setIsVideoPlaying((prev) => !prev);
                    }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                  >
                    {isVideoPlaying ? (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <rect x="6" y="4" width="4" height="16" />
                        <rect x="14" y="4" width="4" height="16" />
                      </svg>
                    ) : (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <polygon points="5,3 19,12 5,21" />
                      </svg>
                    )}
                  </button> */}
      </div>
    </div>
  );
};

export default CH1_Herot;
