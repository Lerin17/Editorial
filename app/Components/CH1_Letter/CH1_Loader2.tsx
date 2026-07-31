import React from "react";
import Image from "next/image";
import planImage2 from "../../../public/img/plan_3.png";
import image2 from "../../../public/img/sliderImages/slider1_render.jpg";
import image3 from "../../../public/img/sliderImages/slider1_couple.jpg";
import image4 from "../../../public/img/sliderImages/slider2_plan.jpg";
import image5 from "../../../public/img/sliderImages/slider3_render2.png";

import { useUtilityContext } from "../../Context/Utility";
import { motion } from "framer-motion";

type Slide = {
  id: number;
  src: any;

  lane: "foreground" | "mid" | "background";
  size: "hero" | "large" | "medium" | "small";

  x: number;
  xAnimate: number | string | Array<number | string>;
  y: number;

  opacity: number[];
  speed: number[];
  duration: number;
  delay: number;

  scale: number;
  // rotation: number;

  z: number;
  blur: number;

  parallax: number;
  imageWidth: number;
  imageHeight: number;
};

interface SlideProps {
  slide: Slide;
}

type MotionMoverProps = {
  slide: Slide;
};

const MotionMover = ({ slide, ...props }: MotionMoverProps) => (
  <motion.div
    className="absolute"
    style={{
      // width: frameWidth,
      // // height: frameHeight,
      // maxWidth: "400px",
      // maxHeight: "600px",

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
      // rotate: slide.rotation,
    }}
    animate={{
      x: slide.xAnimate,
      opacity: slide.opacity,
      speed: slide.speed,
      // scale: [
      //   slide.scale,
      //   slide.size === "hero" ? slide.scale + 0.08 : slide.scale,
      //   slide.scale,
      // ],
    }}
    transition={{
      duration: slide.duration,
      delay: slide.delay,
      ease: "easeInOut",
    }}
  >
    <Image
      src={slide.src}
      alt=""
      width={slide.imageWidth}
      height={slide.imageHeight}
      className="pointer-events-none select-none"
    />
    <div className="text-black">{String(slide.id)}</div>
  </motion.div>
);

const CH1_Loader2 = () => {
  const { screenSize, currentSection } = useUtilityContext();
  const [isImageSequence, setisImageSequence] = React.useState(0);
  const [showImages, setShowImages] = React.useState(true);
  const defaultOpacity = [0, 1, 1, 1, 1, 1, 1];
  const defaultSpeed = [1, 0.7, 0.4, 0.4, 0.8, 1.3];
  const frameWidth = "90%";
  const frameHeight = "100vh";

  React.useEffect(() => {
    if (!showImages) return;

    const timer = window.setInterval(() => {
      setisImageSequence((prev) => prev + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [showImages]);

  React.useEffect(() => {
    if (isImageSequence >= 7) {
      setShowImages(false);
    }
  }, [isImageSequence]);

  const images: Slide[] = [
    {
      id: 1,
      src: image3,

      // layout
      lane: "foreground",
      size: "hero",

      // start position
      x: 800,
      xAnimate: window.innerWidth + 300,
      y: -120,

      // movement
      opacity: defaultOpacity,
      speed: [0.5],
      duration: 7,
      delay: 0.5,

      // emphasis
      scale: 0.6,
      // rotation: -3,

      // depth
      z: 3,
      blur: 0,

      // randomness
      parallax: 1.8,
      imageWidth: 320,
      imageHeight: 420,
    },

    {
      id: 2,
      src: image2,

      lane: "mid",
      size: "medium",

      x: 100,
      xAnimate: window.innerWidth + 300,
      y: -200,

      opacity: defaultOpacity,
      speed: [0.5],
      duration: 13,
      delay: 1.6,

      scale: 0.5,
      // rotation: 2,

      z: 2,
      blur: 0.3,

      parallax: 1,
      imageWidth: 280,
      imageHeight: 360,
    },

    {
      id: 3,
      src: image5,

      lane: "background",
      size: "small",

      x: 80,
      y: 40,
      xAnimate: window.innerWidth + 300,

      opacity: [0, 1, 1, 1, 1, 1, 1],
      speed: defaultSpeed,
      duration: 11,
      delay: 1.5,

      scale: 0.8,
      // rotation: -1,

      z: 1,
      blur: 0,

      parallax: 0.6,
      imageWidth: 824,
      imageHeight: 450,
    },

    {
      id: 4,
      src: planImage2,
      lane: "foreground",
      size: "small",
      x: 120,
      y: 250,
      xAnimate: "110vw",
      opacity: defaultOpacity,
      speed: defaultSpeed,
      duration: 12,
      delay: 1.7,
      scale: 0.2,
      z: 4,
      blur: 0.2,
      parallax: 0.7,
      imageWidth: 400,
      imageHeight: 280,
    },

    // {
    //   id: 5,
    //   src: image4,
    //   lane: "mid",
    //   size: "small",
    //   x: 70,
    //   y: -80,
    //   opacity: defaultOpacity,
    //   speed: defaultSpeed,
    //   duration: 3.6,
    //   delay: 1.6,
    //   scale: 0.18,
    //   z: 2,
    //   blur: 0.4,
    //   parallax: 0.55,
    //   imageWidth: 120,
    //   imageHeight: 160,
    // },

    // {
    //   id: 6,
    //   src: image2,
    //   lane: "background",
    //   size: "small",
    //   x: -40,
    //   y: 60,
    //   opacity: defaultOpacity,
    //   speed: defaultSpeed,
    //   duration: 3.2,
    //   delay: 2.1,
    //   scale: 0.16,
    //   z: 1,
    //   blur: 0.6,
    //   parallax: 0.45,
    //   imageWidth: 110,
    //   imageHeight: 148,
    // },
  ];

  return (
    <div className="h-screen w-screen bg-white flex items-center overflow-hidden">
      <div className="bg-red-400">{String(isImageSequence)}</div>
      {images.map((item) => (
        <MotionMover key={item.id} slide={item} />
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
