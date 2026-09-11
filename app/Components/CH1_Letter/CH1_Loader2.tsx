import React from "react";
import Image from "next/image";
import planImage2 from "../../../public/img/plan_3.png";
import image2 from "../../../public/img/sliderImages/slider1_render.jpg";
import image3 from "../../../public/img/sliderImages/slider1_couple.jpg";
import image4 from "../../../public/img/sliderImages/slider2_plan.jpg";
import image5 from "../../../public/img/sliderImages/slider3_render2.png";
import Hero from "./3D/TextContainer";
import { useUtilityContext } from "../../Context/Utility";
import { motion } from "framer-motion";
import Loader from "./Lottie/Loader";
import { get } from "http";

type Slide = {
  id: number;
  type?: SlideType;
  src: any;
  srcName: string;

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

type SlideType = "images1" | "images2" | "afterburner";
type ScreenSizeCategory = "isSmall" | "isMedium" | "isLarge";

type AnimationViewport = {
  screenSizeCategory: ScreenSizeCategory;
  horizontalMoveValue: number;
};

const getScreenSizeCategory = (width: number): ScreenSizeCategory =>
  width < 768 ? "isSmall" : width < 1280 ? "isMedium" : "isLarge";

interface SlideProps {
  slide: Slide;
}

type MotionMoverProps = {
  slide: Slide;
};

const BASE_SPEED = [14, 10, 8, 8, 12, 15];
const ACCELERATE_SPEED = [1, 0.7, 0.4, 0.4, 0.8, 1.3];

const MotionMover = ({ slide, ...props }: MotionMoverProps) => (
  <motion.div
    className="absolute border bg-gray-200"
    style={{
      // width: frameWidth,
      // height: frameHeight,
      maxWidth: "800px",
      maxHeight: "600px",

      // minWidth: "320px",
      // minHeight: "420px",
      zIndex: slide.z + 1,
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
      className="pointer-events-none select-none object-contain"
    />
    <div className="text-black flex">
      {`${slide.type ?? "unassigned"}-${slide.srcName}`}
      <span className="ml-2">{slide.type}</span>
    </div>
  </motion.div>
);

const CH1_Loader2 = () => {
  const {
    screenSize,
    screenSizeHistory,
    currentSection,
    mousePosition,
    isCanUserSkipAnimation,
    isOpeningSequence,
    setIsOpeningSequence,
    isUnloadLoader,
    isPhone,
  } = useUtilityContext();
  const [isImageSequence, setIsImageSequence] = React.useState(0);
  const [isBeginFadeIn, setIsBeginFadeIn] = React.useState(false);
  const [renderStage, setRenderStage] = React.useState(0);
  const [isAccelerateImages, setIsAccelerateImages] = React.useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = React.useState(false);
  const [animationViewport, setAnimationViewport] =
    React.useState<AnimationViewport>(() => ({
      screenSizeCategory: getScreenSizeCategory(screenSizeHistory.current.width),
      horizontalMoveValue: screenSizeHistory.current.width + 400,
    }));


  const defaultOpacity = [0, 1, 1, 1, 1, 1, 1];
  const [defaultSpeed, setDefaultSpeed] = React.useState(BASE_SPEED);
  const frameWidth = "90%";
  const frameHeight = "100vh";

  React.useEffect(() => {
    if (isOpeningSequence) {
      setTimeout(() => {
        setIsBeginFadeIn(true);
      }, 1500);
    }
  }, [isOpeningSequence]);

  React.useEffect(() => {
    if (renderStage >= 2) return;

    const timer = window?.setInterval(() => {
      let renderStage1Timeout = 1;

      let renderStage2Timeout = 6;

      renderStage1Timeout = 1;
      renderStage2Timeout =  6;

      setIsImageSequence((prev) => {
        const next = prev + 1;

        if (next >= renderStage1Timeout) {
          setRenderStage(1);
        }

        if (next >= renderStage2Timeout) {
          setRenderStage(2);
          window.clearInterval(timer);
        }

        return next;
      });
    }, 500);

    return () => window.clearInterval(timer);
  }, [renderStage]);

  React.useEffect(() => {
    if (isAccelerateImages) {
      console.log("Accelerate images");
    }

    setDefaultSpeed(isAccelerateImages ? ACCELERATE_SPEED : BASE_SPEED);
  }, [isAccelerateImages]);




  // for 2x acceleration of 3 entries
  const [scrollLog, setScrollLog] = React.useState<
    { scrollNumber: number; scrollValue: number }[]
  >([]);

  const hasScrolled = (scrollNumber: number) =>
    scrollLog.some((entry) => entry.scrollNumber === scrollNumber);

  React.useEffect(() => {
    if (isUnloadLoader) return;

    const handleMouseScroll = (event: WheelEvent) => {
      console.log("mouse scroll");

      // for 2x acceleration of 3 entries
      setScrollLog((prev) => {
        if (prev.length >= 6) return prev;

        const next = [
          ...prev,
          { scrollNumber: prev.length + 1, scrollValue: event.deltaY },
        ];

        next.forEach((entry) =>
          console.log(entry.scrollNumber, entry.scrollValue),
        );

        return next;
      });
    };

    window.addEventListener("wheel", handleMouseScroll);

    return () => window.removeEventListener("wheel", handleMouseScroll);
  }, [isUnloadLoader]);


  React.useEffect(() => {

    // const scrollItem3Value = scrollLog[2].scrollNumber 
    if (!scrollLog[2]) {
      return;
    }

    const timer = window.setTimeout(() => {
      setIsOpeningSequence(true);
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [scrollLog, setIsOpeningSequence]);

  console.log(defaultSpeed, "defaultSpeed");

  React.useEffect(() => {
    
  }, []);

  React.useEffect(() => {
    const currentWidth = screenSizeHistory.current.width;
    const currentScreenSizeCategory = getScreenSizeCategory(currentWidth);

    if (
      animationViewport.screenSizeCategory === currentScreenSizeCategory
    ) {
      return;
    }

    if (!animationViewport.horizontalMoveValue) {
      setAnimationViewport({
        screenSizeCategory: currentScreenSizeCategory,
        horizontalMoveValue: currentWidth + 400,
      });
      return;
    }
    // setAnimationViewport({
    //   screenSizeCategory: currentScreenSizeCategory,
    //   horizontalMoveValue: currentWidth + 400,
    // });

  }, []);


  
  React.useEffect(() => {
    const currentWidth = screenSizeHistory.current.width;
    const currentScreenSizeCategory = getScreenSizeCategory(currentWidth);

    if (
      animationViewport.screenSizeCategory === currentScreenSizeCategory
    ) {
      return;
    }


          // ONLY RUN WHEN ANIMATION IS ONGOING

    if (animationViewport.horizontalMoveValue) {
      const prevScreenSizeCategory = animationViewport.screenSizeCategory;
      const red = ['isSmall', 'isMedium', 'isLarge'];

      const blue = red.map((item, id) => ({
        title: item,
        value: id,
      }))


      const compareValues = (value1:string, value2:string) => {
        const index1 = blue.findIndex(item => item.title === value1);
        const index2 = blue.findIndex(item => item.title === value2);
          console.log(value1, value2, "INDEDD");
        console.log(index1, index2, "INDEDD");
      
        if(index1 > index2){
          return true
        }else if(index1 < index2){
          return false
        }else {
          return true;
        }
      }
      
      compareValues(prevScreenSizeCategory, currentScreenSizeCategory)

      console.log(blue, 'value')
      if(!compareValues(prevScreenSizeCategory, currentScreenSizeCategory)) {
              setAnimationViewport({
        screenSizeCategory: currentScreenSizeCategory,
        horizontalMoveValue: currentWidth + 400,
      });
      }

      return;
    }


  }, [screenSizeHistory]);


  const images: Slide[] = [
    {
      id: 1,
      src: image3,
      srcName: "image3",

      // layout
      lane: "foreground",
      size: "hero",
      // start position
      x: isPhone ? 800 : 800,
       xAnimate: isAccelerateImages
        ? animationViewport.horizontalMoveValue + 400
        : animationViewport.horizontalMoveValue,
      y: isPhone ? -120 : -120,

      // movement
      opacity: defaultOpacity,
      speed: defaultSpeed,
      duration: isAccelerateImages ? 1 : 10,
      delay: isAccelerateImages ? 0 : 0.5,

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
      srcName: "image2",

      lane: "mid",
      size: "medium",

      x: isPhone ? 500 : 500,
  xAnimate: isAccelerateImages
        ? animationViewport.horizontalMoveValue + 400
        : animationViewport.horizontalMoveValue,
      y: isPhone ? -200 : -200,

      opacity: defaultOpacity,
      speed: defaultSpeed,
      duration: isAccelerateImages ? 1 : 13,
      delay: isAccelerateImages ? 0.16 : 1.6,

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
      srcName: "image5",

      lane: "background",
      size: "small",

      x: isPhone ? 80 : 80,
      y: isPhone ? 40 : 40,
      xAnimate: isAccelerateImages
        ? animationViewport.horizontalMoveValue + 400
        : animationViewport.horizontalMoveValue,

      opacity: [0, 1, 1, 1, 1, 1, 1],
      speed: defaultSpeed,
      duration: isAccelerateImages ? 1 : 11,
      delay: isAccelerateImages ? 0.15 : 1.5,

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
      srcName: "planImage2",
      lane: "foreground",
      size: "small",
      x: isPhone ? 120 : 120,
      y: isPhone ? 170 : 170,
      xAnimate: isAccelerateImages
        ? animationViewport.horizontalMoveValue + 400
        : animationViewport.horizontalMoveValue,
      opacity: defaultOpacity,
      speed: defaultSpeed,
      duration: isAccelerateImages ? 1 : 12,
      delay: isAccelerateImages ? 0.17 : 1.7,
      scale: 0.5,
      z: 0,
      blur: 0,
      parallax: 0.7,
      imageWidth: 400,
      imageHeight: 280,
    },

    {
      id: 5,
      src: image4,
      srcName: "image4",
      lane: "mid",
      size: "small",
      x: isPhone ? 70 : 70,
      y: isPhone ? -80 : -80,
      opacity: defaultOpacity,
      speed: defaultSpeed,
      duration: isAccelerateImages ? 1 : 10,
      delay: isAccelerateImages ? 0.36 : 3.6,
      scale: 1,
     xAnimate: isAccelerateImages
        ? animationViewport.horizontalMoveValue + 400
        : animationViewport.horizontalMoveValue,
      z: 2,
      blur: 0.4,
      parallax: 0.55,
      imageWidth: 320,
      imageHeight: 420,
    },

    {
      id: 6,
      src: image2,
      srcName: "image2",
      lane: "background",
      size: "small",
      x: isPhone ? -40 : -40,
      y: isPhone ? 60 : 60,
      opacity: defaultOpacity,
      speed: defaultSpeed,
      duration: isAccelerateImages ? 1 : 12,
      xAnimate: isAccelerateImages
        ?  animationViewport.horizontalMoveValue + 400
        : animationViewport.horizontalMoveValue,
      delay: isAccelerateImages ? 0.41 : 4.1,
      scale: 1,
      z: 1,
      blur: 0.6,
      parallax: 0.45,
      imageWidth: 110,
      imageHeight: 148,
    },
  ];

  const addSlideType = (slides: Slide[], type: SlideType): Slide[] =>
    slides.map((slide) => ({ ...slide, type }));

  const images1 = addSlideType(
    [
      {
        id: 1,
        src: image3,
        srcName: "image3",
        lane: "foreground",
        size: "hero",
        x: isPhone ? 800 : 800,
        xAnimate: hasScrolled(1)
          ? animationViewport.horizontalMoveValue + 400
          : animationViewport.horizontalMoveValue,
        y: isPhone ? -120 : -120,
        opacity: defaultOpacity,
        speed: defaultSpeed,
        duration: hasScrolled(1) ? 1 : 10,
        delay: hasScrolled(1) ? 0 : 0,
        scale: 0.6,
        z: 3,
        blur: 0,
        parallax: 1.8,
        imageWidth: 320,
        imageHeight: 420,
      },
    ],
    "images1",
  );

  const images2 = addSlideType(
    [
        {
      id: 2,
      src: image5,
      srcName: "image5",

      lane: "background",
      size: "small",

      x: isPhone ? 80 : 80,
      y: isPhone ? 20 : 20,
      xAnimate: hasScrolled(2)
        ? animationViewport.horizontalMoveValue + 400
        : animationViewport.horizontalMoveValue,

      opacity: [0, 1, 1, 1, 1, 1, 1],
      speed: defaultSpeed,
      duration: hasScrolled(2) ? 1 : 11,
      delay: hasScrolled(2) ? 0.15 : 0.2,

      scale: 0.8,
      // rotation: -1,

      z: 1,
      blur: 0,

      parallax: 0.6,
      imageWidth: 824,
      imageHeight: 450,
    },
       {
      id: 3,
      src: image2,
      srcName: "image2",

      lane: "mid",
      size: "medium",

      x: isPhone ? 280 : 280,
  xAnimate: hasScrolled(2)
        ? animationViewport.horizontalMoveValue + 400
        : animationViewport.horizontalMoveValue,
      y: isPhone ? -240 : -240,

      opacity: defaultOpacity,
      speed: defaultSpeed,
      duration: hasScrolled(2) ? 1 : 13,
      delay: hasScrolled(2) ? 0.16 : 1.4,

      scale: 0.5,
      // rotation: 2,

      z: 2,
      blur: 0.3,

      parallax: 1,
      imageWidth: 280,
      imageHeight: 360,
    },
    
    ],
    "images2",
  );

  const afterburnerImages = addSlideType(
    [
      {
        id: 3,
        src: image5,
        srcName: "image5",
        lane: "background",
        size: "small",
        x: isPhone ? 80 : 80,
        y: isPhone ?-40 : -40,
        xAnimate: hasScrolled(3)
          ? animationViewport.horizontalMoveValue + 400
          : animationViewport.horizontalMoveValue,
        opacity: [0, 1, 1, 1, 1, 1, 1],
        speed: defaultSpeed,
        duration: hasScrolled(3) ? 1 : 11,
        delay: hasScrolled(3) ? 0.15 : 0.7,
        scale: 0.8,
        z: 1,
        blur: 0,
        parallax: 0.6,
        imageWidth: 454,
        imageHeight: 820,
      },
      {
        id: 4,
        src: planImage2,
        srcName: "planImage2",
        lane: "foreground",
        size: "small",
        x: isPhone ? 120 : 120,
        y: isPhone ? -240 : -240,
        xAnimate: hasScrolled(3)
          ? animationViewport.horizontalMoveValue + 400
          : animationViewport.horizontalMoveValue,
        opacity: defaultOpacity,
        speed: defaultSpeed,
        duration: hasScrolled(3) ? 1 : 12,
        delay: hasScrolled(3) ? 0.17 : 3.9,
        scale: 0.5,
        z: 0,
        blur: 0,
        parallax: 0.7,
        imageWidth: 400,
        imageHeight: 680,
      },
      {
        id: 5,
        src: image4,
        srcName: "image4",
        lane: "mid",
        size: "small",
        x: isPhone ? 70 : 70,
        y: isPhone ? 0 : 0,
        opacity: defaultOpacity,
        speed: defaultSpeed,
        duration: hasScrolled(3) ? 1 : 10,
        delay: hasScrolled(3) ? 0.36 : 2.5,
        scale: 1,
        xAnimate: hasScrolled(3)
          ? animationViewport.horizontalMoveValue + 400
          : animationViewport.horizontalMoveValue,
        z: 2,
        blur: 0.4,
        parallax: 0.55,
        imageWidth: 400,
        imageHeight: 520,
      },
      {
        id: 6,
        src: image2,
        srcName: "image2",
        lane: "background",
        size: "small",
        x: isPhone ? -40 : -40,
        y: isPhone ? 60 : 60,
        opacity: defaultOpacity,
        speed: defaultSpeed,
        duration: hasScrolled(3) ? 1 : 12,
        xAnimate: hasScrolled(3)
          ? animationViewport.horizontalMoveValue + 400
          : animationViewport.horizontalMoveValue,
        delay: hasScrolled(3) ? 0.41 :3.6,
        scale: 1,
        z: 1,
        blur: 0.6,
        parallax: 0.45,
        imageWidth: 110,
        imageHeight: 148,
      },
    ],
    "afterburner",
  );
  return (
    <motion.div
      animate={{ opacity: isOpeningSequence ? 0 : 1 }}
      transition={{
        duration: 0.5,
        ease: "easeInOut",
        delay: isOpeningSequence ? 2 : 0,
      }}
      onClick={() => {
        if (isCanUserSkipAnimation.letUserSkip) {
          console.log("User clicked to skip animation");
          setIsAccelerateImages(true);
        }
      }}
      className="relative h-screen w-screen bg-white flex items-center overflow-hidden"
    >
      <motion.div
        className="fixed font-archivo top-0 left-0 w-20 h-20 rounded-full text-white text-center flex items-center justify-center pointer-events-none text-sm font-base z-50 "
        animate={{
          x: mousePosition.x - 40,
          y: mousePosition.y - 40,
          scale: isCanUserSkipAnimation.letUserSkip ? 1 : 0.7,
          backgroundColor: isCanUserSkipAnimation.letUserSkip
            ? "rgba(0, 0, 0,)"
            : "#0b0a19",
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 35,
          mass: 0.2,
        }}
      >
        {isCanUserSkipAnimation.letUserSkip ? "Enter Site" : "..."}
      </motion.div>
      <div className="absolute  inset-0 z-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{}}

          onClick={() => {
            if (isCanUserSkipAnimation.letUserSkip) {
              console.log("User clicked to skip animation");
              setIsAccelerateImages(true);
            }
          }}
          className="h-screen w-[390px] max-w-[90vw] flex items-center justify-center"
        >
          Wumba
        </motion.div>
      </div>

      <div className="bg-red-400">{String(isImageSequence)}</div>
      {images1.map((item) => (
        <MotionMover key={`${item.type}-${item.id}`} slide={item} />
      ))}
      {renderStage >= 1 &&
        images2.map((item) => (
          <MotionMover key={`${item.type}-${item.id}`} slide={item} />
        ))}

      {renderStage >= 2 &&
        afterburnerImages.map((item) => (
          <MotionMover key={`${item.type}-${item.id}`} slide={item} />
        ))}

      {isOpeningSequence && (
        <motion.div
          className="fixed inset-0 z-[200]"
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            animate={{ opacity: isBeginFadeIn ? 0 : 1 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-white"
          >
            <div className="flex flex-col items-center justify-center w-full h-8/12 border">
              {/* <Hero /> */}
              <motion.div
                animate={{ opacity: isBeginFadeIn ? 0 : 1 }}
                transition={{ duration: 3, ease: "easeInOut" }}
                className="text-black text-6xl font-archivo font-bold"
              >
                The Vale Wumba
              </motion.div>
              <div className="text-black  font-archivo ">Netconstruct</div>
            </div>
          </motion.div>
        </motion.div>
      )}

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
    </motion.div>
  );
};

export default CH1_Loader2;
