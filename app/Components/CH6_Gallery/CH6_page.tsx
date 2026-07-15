"use client";

import React from "react";
// import BufferAnimation from "../LottieFiles/Bufferloader";
import DisplayScreen from "./DisplayScreen";
import Masonry from "react-masonry-css";
import Image from "next/image";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useUtilityContext } from "../../Context/Utility";

// MUI imports
import {
  Drawer,
  SwipeableDrawer,
  Button,
  useMediaQuery,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List,
  ListItem,
  ListItemButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

const CH6_page = () => {
  const [isGalleryDisplayScreenActive, setIsGalleryDisplayScreenActive] =
    React.useState<boolean>(true);

  return (
    <div
      // onMouseMove={(e) => handleMove}
      className="overflow-y-hidden h-screen cursor-none border bg-white"
    >
      {/* {!isGalleryDisplayScreenActive && <div>Gallery</div>} */}

      <div className="flex items-center justify-center h-full bg-zinc-100 border-b text-black font-sans text-lg font-semibold">
        {isGalleryDisplayScreenActive ? (
          <DisplayScreen
            isGalleryDisplayScreenActive={isGalleryDisplayScreenActive}
            setIsGalleryDisplayScreenActive={setIsGalleryDisplayScreenActive}
          />
        ) : (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="flex gap-4 px-10 mt-10"
            columnClassName="flex flex-col gap-4"
          >
            {[
              "https://res.cloudinary.com/dxjys4qpi/image/upload/v1757757697/Lerin%27s%20Portfolio/Client%204%20%28Apo%20Drive%29/MIN/LIGHT_1_lo7lte_tbthzk.avif",
              "https://res.cloudinary.com/dxjys4qpi/image/upload/v1757757697/Lerin%27s%20Portfolio/Client%204%20%28Apo%20Drive%29/MIN/LIGHT_1_lo7lte_tbthzk.avif",
              "https://res.cloudinary.com/dxjys4qpi/image/upload/v1757757697/Lerin%27s%20Portfolio/Client%204%20%28Apo%20Drive%29/MIN/LIGHT_1_lo7lte_tbthzk.avif",
              "https://res.cloudinary.com/dxjys4qpi/image/upload/v1757757697/Lerin%27s%20Portfolio/Client%204%20%28Apo%20Drive%29/MIN/LIGHT_1_lo7lte_tbthzk.avif",
              "https://res.cloudinary.com/dxjys4qpi/image/upload/v1758505279/Lerin%27s%20Portfolio/Client%202/awolhfzkyhzjuhvfb4xp_kjtrph.avif",
              "https://res.cloudinary.com/dxjys4qpi/image/upload/v1757757697/Lerin%27s%20Portfolio/Client%204%20%28Apo%20Drive%29/MIN/LIGHT_1_lo7lte_tbthzk.avif",
              "https://res.cloudinary.com/dxjys4qpi/image/upload/v1757757697/Lerin%27s%20Portfolio/Client%204%20%28Apo%20Drive%29/MIN/LIGHT_1_lo7lte_tbthzk.avif",
              "https://res.cloudinary.com/dxjys4qpi/image/upload/v1757757697/Lerin%27s%20Portfolio/Client%204%20%28Apo%20Drive%29/MIN/LIGHT_1_lo7lte_tbthzk.avif",
              "https://res.cloudinary.com/dxjys4qpi/image/upload/v1757757697/Lerin%27s%20Portfolio/Client%204%20%28Apo%20Drive%29/MIN/LIGHT_1_lo7lte_tbthzk.avif",
              "https://res.cloudinary.com/dxjys4qpi/image/upload/v1757757697/Lerin%27s%20Portfolio/Client%204%20%28Apo%20Drive%29/MIN/LIGHT_1_lo7lte_tbthzk.avif",
              "https://res.cloudinary.com/dxjys4qpi/image/upload/v1757757697/Lerin%27s%20Portfolio/Client%204%20%28Apo%20Drive%29/MIN/LIGHT_1_lo7lte_tbthzk.avif",
              "https://res.cloudinary.com/dxjys4qpi/image/upload/v1757757697/Lerin%27s%20Portfolio/Client%204%20%28Apo%20Drive%29/MIN/LIGHT_1_lo7lte_tbthzk.avif",
              "https://res.cloudinary.com/dxjys4qpi/image/upload/v1757757697/Lerin%27s%20Portfolio/Client%204%20%28Apo%20Drive%29/MIN/LIGHT_1_lo7lte_tbthzk.avif",
              "https://res.cloudinary.com/dxjys4qpi/image/upload/v1757757697/Lerin%27s%20Portfolio/Client%204%20%28Apo%20Drive%29/MIN/LIGHT_1_lo7lte_tbthzk.avif",
              "https://res.cloudinary.com/dxjys4qpi/image/upload/v1757757697/Lerin%27s%20Portfolio/Client%204%20%28Apo%20Drive%29/MIN/LIGHT_1_lo7lte_tbthzk.avif",
              "https://res.cloudinary.com/dxjys4qpi/image/upload/v1757757697/Lerin%27s%20Portfolio/Client%204%20%28Apo%20Drive%29/MIN/LIGHT_1_lo7lte_tbthzk.avif",
              "https://res.cloudinary.com/dxjys4qpi/image/upload/v1757757697/Lerin%27s%20Portfolio/Client%204%20%28Apo%20Drive%29/MIN/LIGHT_1_lo7lte_tbthzk.avif",
              "https://res.cloudinary.com/dxjys4qpi/image/upload/v1757757697/Lerin%27s%20Portfolio/Client%204%20%28Apo%20Drive%29/MIN/LIGHT_1_lo7lte_tbthzk.avif",
            ].map((src, i) => (
              <div key={i} className="relative w-full">
                <Image
                  src={src}
                  alt=""
                  width={500}
                  height={600}
                  className="rounded-sm"
                />
              </div>
            ))}
          </Masonry>
        )}
      </div>
    </div>
  );
};

export default CH6_page;
