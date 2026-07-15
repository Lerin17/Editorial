import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useUtilityContext } from "../../Context/Utility";

interface DisplayScreenProps {
  isGalleryDisplayScreenActive: boolean;
  setIsGalleryDisplayScreenActive: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

const GalleryImageCard = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <div className="relative aspect-[4/3] w-[min(30vw,320px)] overflow-hidden rounded-sm bg-white shadow-sm">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 320px"
        className="object-cover"
      />
    </div>
  );
};

const DisplayScreen = ({
  isGalleryDisplayScreenActive,
  setIsGalleryDisplayScreenActive,
}: DisplayScreenProps) => {
  const { mousePosition } = useUtilityContext();

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-zinc-100 px-6">
      {isGalleryDisplayScreenActive && (
        <motion.div
          className="fixed w-20 h-20 rounded-full bg-red-400 text-black flex items-center justify-center pointer-events-none z-50"
          animate={{
            x: mousePosition.x - 40,
            y: mousePosition.y - 40,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 35,
            mass: 0.2,
          }}
        >
          View
        </motion.div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-6">
        <GalleryImageCard
          src="https://res.cloudinary.com/dxjys4qpi/image/upload/v1757757697/Lerin%27s%20Portfolio/Client%204%20%28Apo%20Drive%29/MIN/LIGHT_1_lo7lte_tbthzk.avif"
          alt="Gallery image one"
        />
        <GalleryImageCard
          src="https://res.cloudinary.com/dxjys4qpi/image/upload/v1758505279/Lerin%27s%20Portfolio/Client%202/awolhfzkyhzjuhvfb4xp_kjtrph.avif"
          alt="Gallery image two"
        />
        <GalleryImageCard
          src="https://res.cloudinary.com/dxjys4qpi/image/upload/v1757757697/Lerin%27s%20Portfolio/Client%204%20%28Apo%20Drive%29/MIN/LIGHT_1_lo7lte_tbthzk.avif"
          alt="Gallery image three"
        />
      </div>

      <button
        type="button"
        onClick={() => {
          setIsGalleryDisplayScreenActive(false);
        }}
        className="absolute bottom-8 rounded-full bg-black px-4 py-2 text-sm font-medium text-white"
      >
        Close gallery
      </button>
    </div>
  );
};

export default DisplayScreen;
