"use client";

import React, { useState } from "react";
import Image from "next/image";

import locationImage3 from "../../../public/img/8°5659.5_N 7°2918.4_E - Google Maps 16x-6.png";
import locationImage4 from "../../../public/img/8°5659.5_N 7°2918.4_E - Google Maps 4x-1.png";
import locationImage5 from "../../../public/img/8°5659.5_N 7°2918.4_E - Google Maps 8x-2.png";
import Button_sm from "../Utility/Buttons/Button_sm";
import LoaderCircle from "./Lottie/LottieCircle";

const CH2_page: React.FC = () => {
  const videoSrc = "/vid/Comp_2.mp4";
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [zoomTypeActive, setZoomTypeActive] = React.useState<
    "1x" | "4x" | "8x"
  >("1x");

  const selectedImage =
    zoomTypeActive === "1x"
      ? locationImage4
      : zoomTypeActive === "4x"
        ? locationImage5
        : locationImage3;

  const [prevZoomType, setprevZoomType] = React.useState<string[]>([""]);

  const getPlayback = () => {
    if (videoRef.current) {
      const lastIndex =
        prevZoomType.length <= 2
          ? prevZoomType.length - 1
          : prevZoomType.length - 2;
      if (prevZoomType[lastIndex] === "1x" && zoomTypeActive === "4x") {
        return 0.1;
      } else if (zoomTypeActive === "1x" && prevZoomType[lastIndex] === "4x") {
        return 3.1;
      } else if (zoomTypeActive === "4x" && prevZoomType[lastIndex] === "8x") {
        return 2.1;
      } else if (zoomTypeActive === "8x" && prevZoomType[lastIndex] === "4x") {
        return 9.1;
      } else if (zoomTypeActive === "8x" && prevZoomType[lastIndex] === "1x") {
        return 12.1;
      } else if (zoomTypeActive === "1x" && prevZoomType[lastIndex] === "8x") {
        return 15.1;
      } else {
        return 0.1;
      }

      // return 0;
    }
  };

  React.useEffect(() => {
    setprevZoomType((prev) => [...prev, zoomTypeActive]);
  }, [zoomTypeActive]);

  React.useEffect(() => {
    let lastIndex =
      prevZoomType.length == 2
        ? prevZoomType.length - 1
        : prevZoomType.length - 1;
    console.log(
      "prevZoomTypeceex-",
      prevZoomType,
      "zoontypeActive-",
      zoomTypeActive,
      "prevlastindex",
      prevZoomType[lastIndex],
      getPlayback(),
    );

    console.log("prevZoomType.length", prevZoomType.length);

    console.log("prevZoomType", prevZoomType.length);

    if (videoRef.current && prevZoomType.length > 2) {
      videoRef.current.currentTime = Number(getPlayback());
      videoRef.current.play();
      console.log("videoRef.current.currentTime", videoRef.current.currentTime);
    }
  }, [prevZoomType]);

  // const delayedSequence = (firstDelay: number, secondDelay: number) => {
  //   return new Promise<void>((resolve) => {
  //     setTimeout(() => {
  //       console.log("First timeout complete");
  //       // Do something after first timeout...

  //       setTimeout(() => {
  //         console.log("Second timeout complete");
  //         resolve();
  //       }, secondDelay);
  //     }, firstDelay);
  //   });
  // };

  console.log("prevZoomType", prevZoomType);

  // React.useEffect(() => {
  //   let timeoutId: number | undefined;

  //   if (videoRef.current && zoomTypeActive === "4x") {
  //     videoRef.current.currentTime = 0.1;
  //     timeoutId = window.setTimeout(() => {
  //       videoRef.current?.pause();
  //     }, 2000);
  //   }

  //   return () => {
  //     if (timeoutId !== undefined) {
  //       window.clearTimeout(timeoutId);
  //     }
  //   };
  // }, [zoomTypeActive]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white">
      {videoSrc ? (
        <video
          className="transition-all absolute"
          ref={videoRef}
          src={videoSrc}
          // autoPlay
          muted
          // loop
          playsInline
          style={
            zoomTypeActive === "4x"
              ? {
                  position: "absolute",
                  width: "450px",
                  height: "600px",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 200,
                  objectFit: "cover",
                }
              : zoomTypeActive === "8x"
                ? {
                    position: "absolute",
                    width: "200px",
                    height: "200px",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 200,
                    objectFit: "cover",
                  }
                : {
                    position: "absolute",
                    width: "800px",
                    height: "600px",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 200,
                    objectFit: "cover",
                  }
          }
        />
      ) : (
        <Image
          src={selectedImage}
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      )}

      <div className="relative z-10 flex h-screen flex-col ">
        <div className="text-black font-archivo font-light  absolute -top-4 left-3 text-[170px] z-20">
          ABUJA
        </div>

        <div
          style={{
            left: "50%",
            transform: "translateX(-50%)",
          }}
          className="text-black w-fit font-archivo font-light absolute left-3 text-[50px] z-20"
        >
          <div className=" items-center gap-2 relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="fill-current w-10 h-10"
            >
              <path d="M24 22h-24l12-20z" />
            </svg>
            {/* 
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="fill-current w-16 h-16"
            >
              <path d="M23.677 18.52c.914 1.523-.183 3.472-1.967 3.472h-19.414c-1.784 0-2.881-1.949-1.967-3.472l9.709-16.18c.891-1.483 3.041-1.48 3.93 0l9.709 16.18z" />
            </svg> */}

            <div className="text-black font-milligram font-bold font-light absolute top-5 left-[8px]  text-[50px] z-20">
              N
            </div>
          </div>
        </div>

        <div className="absolute z-0">
          <LoaderCircle />
        </div>

        {/* <div className="text-black font-archivo font-light  absolute top-32 left-3 text-[150px] z-20">
          ABUJA
        </div> */}

        {/* <div className="relative h-full text-black w-full flex justify-center items-center">
          <div className="w-[90%]  lg:w-[85%]   flex justify-between">
            <div className="text-gray-800 font-archivo ">
              <div>Abuja, Nigeria</div>
              <div>Cadzone 10 Plot 96</div>
              <div>9.011 5.001</div>
            </div>

            <div className="font-archivo">
              <div>Lagos, Nigeria</div>
              <div>9.011 5.001</div>
            </div>
          </div>
        </div> */}

        <div className="absolute bottom-0 left-0 right-0 mb-6 flex justify-center">
          <div className="flex flex-wrap justify-center gap-4 w-full max-w-md sm:max-w-lg">
            <Button_sm
              active={true}
              execute={() => {
                if (
                  videoRef.current &&
                  videoRef.current.paused &&
                  zoomTypeActive !== "8x"
                ) {
                  setZoomTypeActive("8x");

                  // const timeSkip = Number(getPlayback());
                  // console.log("timeSkip", getPlayback(), timeSkip);
                  // // videoRef.current.currentTime = timeSkip;

                  // videoRef.current.play();

                  // setprevZoomType((prev) => [...prev, zoomTypeActive]);
                  setTimeout(() => {
                    if (videoRef.current) {
                      // videoRef.current.currentTime = 0.4;
                      videoRef.current.pause();
                    }
                  }, 1000);
                }
              }}
              label="8x"
            />

            <Button_sm
              active={true}
              execute={() => {
                if (
                  videoRef.current &&
                  videoRef.current.paused &&
                  zoomTypeActive !== "4x"
                ) {
                  setZoomTypeActive("4x");

                  // const timeSkip = Number(getPlayback());
                  // videoRef.current.currentTime = timeSkip;
                  // videoRef.current.play();

                  // setprevZoomType((prev) => [...prev, zoomTypeActive]);
                  setTimeout(() => {
                    if (videoRef.current) {
                      // videoRef.current.currentTime = 0.4;
                      videoRef.current.pause();
                    }
                  }, 1000);
                }
              }}
              label="4x"
            />

            <Button_sm
              active={true}
              execute={() => {
                if (
                  videoRef.current &&
                  videoRef.current.paused &&
                  zoomTypeActive !== "1x"
                ) {
                  setZoomTypeActive("1x");
                  // const timeSkip = Number(getPlayback());
                  // videoRef.current.currentTime = timeSkip;
                  // videoRef.current.play();

                  setTimeout(() => {
                    if (videoRef.current) {
                      // videoRef.current.currentTime = 0.4;
                      videoRef.current.pause();
                    }
                  }, 1000);

                  // setprevZoomType((prev) => [...prev, zoomTypeActive]);
                }
              }}
              label="1x"
            />
          </div>
          {/* 
          <div className="mt-4 flex justify-center">
            <Button_sm
              active={true}
              execute={() => {
                if (videoRef.current) {
                  videoRef.current.currentTime = 0.2;
                  videoRef.current.pause();
                }
              }}
              label="Jump to 0.2s"
            />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default CH2_page;
