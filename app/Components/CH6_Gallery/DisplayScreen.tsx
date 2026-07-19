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
    <div className="relative aspect-[16/9] w-[min(78vw,900px)] overflow-hidden rounded-sm bg-white shadow-lg">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 900px"
        className="object-cover"
      />
    </div>
  );
};

const DisplayScreen = ({
  isGalleryDisplayScreenActive,
  setIsGalleryDisplayScreenActive,
}: DisplayScreenProps) => {
  const { mousePosition, currentSection } = useUtilityContext();

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-zinc-100 px-6 relative">
      <motion.div
        className="fixed top-0 left-0 w-20 h-20 rounded-full bg-black text-white text-center flex items-center justify-center pointer-events-none text-sm font-base z-50"
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
        Open Gallery
      </motion.div>

      <div className="absolute left-6 top-6 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-black shadow-sm">
        Active section: {currentSection ?? "unknown"}
      </div>

      <div className="flex items-center justify-center">
        <GalleryImageCard
          src="https://res.cloudinary.com/dxjys4qpi/image/upload/v1757757697/Lerin%27s%20Portfolio/Client%204%20%28Apo%20Drive%29/MIN/LIGHT_1_lo7lte_tbthzk.avif"
          alt="Gallery image"
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
