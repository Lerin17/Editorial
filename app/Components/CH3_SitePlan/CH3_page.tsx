"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image, { type StaticImageData } from "next/image";
import siteImageOne from "../../../public/img/site_4.jpg";
import siteImageTwo from "../../../public/img/siteplan_5.png";
import { useUtilityContext } from "../../Context/Utility";
import Viewer from "./ActivityMap/Activity";

type CarouselSlide =
  | {
      id: string;
      label: string;
      type: "image";
      src: StaticImageData;
      alt: string;
    }
  | {
      id: string;
      label: string;
      type: "component";
      content: React.ReactNode;
    };

const carouselSlides: CarouselSlide[] = [
  {
    id: "site-plan-two",
    label: "Site plan view two",
    type: "image",
    src: siteImageTwo,
    alt: "Site plan view two",
  },
  {
    id: "activity-view",
    label: "Activity",
    type: "component",
    content: <Viewer />,
  },
  {
    id: "site-plan-one",
    label: "Site plan view one",
    type: "image",
    src: siteImageOne,
    alt: "Site plan view one",
  },
];

const CH3_page: React.FC = () => {
  const { screenSize } = useUtilityContext();
  const { isSmall, isMedium } = screenSize;

  const frameWidth = isSmall ? "100vw" : isMedium ? "92vw" : "1080px";
  const frameHeight = isSmall ? "72vh" : isMedium ? "80vh" : "85vh";
  const frameMaxHeight = isSmall ? "460px" : isMedium ? "620px" : "920px";
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <div
      className="bg-white"
      style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}
    >
      <main className="flex min-h-screen items-center justify-center px-4 py-6">
        <motion.div
          className="relative overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
          style={{
            width: frameWidth,
            height: frameHeight,
            maxWidth: "1080px",
            maxHeight: frameMaxHeight,
            minWidth: "280px",
            minHeight: "320px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxSizing: "border-box",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={carouselSlides[activeSlide].id}
              className="relative h-full w-full overflow-hidden "
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -40, opacity: 0 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
            >
              {carouselSlides[activeSlide].type === "image" ? (
                <>
                  <div className="absolute left-4 top-4 z-10 rounded-full  px-3 py-1 text-xs font-medium tracking-[0.2em] text-black/70 backdrop-blur-sm">
                    {carouselSlides[activeSlide].label}
                  </div>
                  <Image
                    src={carouselSlides[activeSlide].src}
                    alt={carouselSlides[activeSlide].alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1080px"
                    style={{ objectFit: "contain", objectPosition: "center" }}
                    priority
                  />
                </>
              ) : (
                <div className="relative h-full w-full bg-[#0c0b0b]">
                  <div className="absolute left-4 top-4 z-10 rounded-full  px-3 py-1 text-xs font-medium tracking-[0.2em] text-black/70 backdrop-blur-sm">
                    {carouselSlides[activeSlide].label}
                  </div>
                  <div className="h-full w-full">
                    {carouselSlides[activeSlide].content}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2 rounded-full bg-white/80 px-3 py-2 backdrop-blur-sm">
            {carouselSlides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Show ${slide.label}`}
                onClick={() => setActiveSlide(index)}
                className={`h-2.5 w-2.5 rounded-full transition-all ${
                  activeSlide === index ? "bg-black scale-110" : "bg-black/25"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default CH3_page;
