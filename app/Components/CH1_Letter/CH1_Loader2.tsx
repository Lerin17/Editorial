import React from "react";
import Image from "next/image";
import planImage2 from "../../../public/img/plan_3.png";
import image2 from "../../../public/img/sliderImages/slider1_render.jpg";
import image3 from "../../../public/img/sliderImages/slider1_couple.jpg";
import image4 from "../../../public/img/sliderImages/slider2_plan.jpg";

import { useUtilityContext } from "../../Context/Utility";
import { delay, motion } from "framer-motion";
import { duration } from "@mui/material";

type Slide = {
  id: number;
  src: any;

  lane: "foreground" | "mid" | "background";
  size: "hero" | "large" | "medium" | "small";

  x: number;
  y: number;

  speed: number;
  duration: number;
  delay: number;

  scale: number;
  rotation: number;

  z: number;
  blur: number;

  parallax: number;
};

interface SlideProps {
  slide: Slide;
}

type MotionMoverProps = {
  slide: any;
};

const MotionMover = ({ slide, ...props }: MotionMoverProps) => (
  <motion.div
    className="absolute"
    style={{
      // width: frameWidth,
      // height: frameHeight,
      maxWidth: "400px",
      maxHeight: "600px",

      minWidth: "320px",
      minHeight: "420px",
      zIndex: slide.z,
      filter: `blur(${slide.blur}px)`,
    }}
    initial={{
      x: slide.x,
      y: slide.y,
      opacity: 0,
      scale: slide.scale,
      rotate: slide.rotation,
    }}
    animate={{
      x: "120vw",
      opacity: [0, 1, 1, 1],
      scale: [
        slide.scale,
        slide.size === "hero" ? slide.scale + 0.08 : slide.scale,
        slide.scale,
      ],
    }}
    transition={{
      duration: slide.duration,
      delay: slide.delay,
      ease: "linear",
    }}
  >
    <Image
      src={slide.src}
      alt=""
      className="pointer-events-none select-none "
    />
  </motion.div>
);

const CH1_Loader2 = () => {
  const { screenSize, currentSection } = useUtilityContext();
  const [isImageSequence, setisImageSequence] = React.useState(0);
  const frameWidth = "90%";
  const frameHeight = "100vh";

  const images = [
    {
      id: 1,
      src: image2,

      // layout
      lane: "foreground",
      size: "hero",

      // start position
      x: -700,
      y: -120,

      // movement
      speed: 1.15,
      duration: 3.4,
      delay: 0,

      // emphasis
      scale: 0.6,
      // rotation: -3,

      // depth
      z: 3,
      blur: 0,

      // randomness
      parallax: 1.8,
    },

    {
      id: 2,
      src: image3,

      lane: "mid",
      size: "medium",

      x: -500,
      y: 80,

      speed: 1,
      duration: 2.9,
      delay: 0.15,

      scale: 0.7,
      // rotation: 2,

      z: 2,
      blur: 0.3,

      parallax: 1,
    },

    {
      id: 3,
      src: image3,

      lane: "background",
      size: "small",

      x: -800,
      y: -200,

      speed: 0.75,
      duration: 3.1,
      delay: 0.75,

      scale: 0.8,
      // rotation: -1,

      z: 1,
      blur: 1,

      parallax: 0.6,
    },

    {
      id: 4,
      src: image3,

      lane: "foreground",
      size: "large",

      x: -650,
      y: 170,

      speed: 1.35,
      duration: 2.6,
      delay: 0.55,

      scale: 1.05,
      // rotation: 4,

      z: 4,
      blur: 0,

      parallax: 2,
    },
  ];

  return (
    <div className="h-screen w-screen bg-white flex items-center overflow-hidden">
      {images.map((item) => (
        <MotionMover slide={item} />
      ))}

      {/* <div
        className="relative overflow-hidden  border border-black"
        style={{
          width: frameWidth,
          height: frameHeight,
          maxWidth: "480px",
          maxHeight: "600px",

          minWidth: "320px",
          minHeight: "420px",

          position: "relative",
          overflow: "hidden",
        }}
      >
        <Image
          src={image2}
          alt="Floor plan background"
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          priority
        />
      </div>

      <div
        className="relative overflow-hidden  border border-black"
        style={{
          width: frameWidth,
          height: frameHeight,
          maxWidth: "400px",
          maxHeight: "600px",

          minWidth: "320px",
          minHeight: "420px",

          position: "relative",
          overflow: "hidden",
        }}
      >
        <Image
          src={image3}
          alt="Floor plan background"
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          priority
        />
      </div>

      <div
        className="relative overflow-hidden  border border-black"
        style={{
          width: frameWidth,
          height: frameHeight,
          maxWidth: "450px",
          maxHeight: "600px",

          minWidth: "320px",
          minHeight: "420px",

          position: "relative",
          overflow: "hidden",
        }}
      >
        <Image
          src={image4}
          alt="Floor plan background"
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          priority
        />
      </div> */}
    </div>
  );
};

export default CH1_Loader2;
