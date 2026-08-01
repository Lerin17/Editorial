import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useUtilityContext } from "../../Context/Utility";

interface DisplayScreen2Props {
  isGalleryDisplayScreenActive: boolean;
  setIsGalleryDisplayScreenActive: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

const LandscapeImageCard = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <div className="relative aspect-[4/3] w-[min(20vw,220px)] overflow-hidden bg-white shadow-lg">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 420px"
        className="object-cover"
      />
    </div>
  );
};

const PortraitImageCard = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <div className="relative object-contain aspect-[7/12] w-[min(26vw,280px)] w-full h-full overflow-hidden bg-white shadow-lg">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) "
        className="object-cover"
      />
    </div>
  );
};

const DisplayScreen2 = ({
  isGalleryDisplayScreenActive,
  setIsGalleryDisplayScreenActive,
}: DisplayScreen2Props) => {
  if (!isGalleryDisplayScreenActive) {
    return null;
  }

  const { mousePosition, currentSection } = useUtilityContext();

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-zinc-100">
      {currentSection === "CH6_Gallery" && (
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
      )}

      <div className="w-9/12 bg-stone-200 h-full">
        <div className="flex flex-col h-full w-full ">
          <div className="text-2xl font-semibold text-black  w-full">05</div>

          <div className=" h-full self-start flex items-end">
            <div className="flex mb-40 h-40">
              <LandscapeImageCard
                src="https://res.cloudinary.com/dxjys4qpi/image/upload/v1758505279/Lerin%27s%20Portfolio/Client%202/awolhfzkyhzjuhvfb4xp_kjtrph.avif"
                alt="Portrait gallery image"
              />

              <div className="h-full bg-gray-100 w-40 px-2 font-archivo  text-xs ">
                lore, in truth and justice
              </div>
            </div>
          </div>

          <div className="absolute -top-14 left-1/2 flex -translate-x-1/2 flex-col text-5xl font-semibold text-black">
            <div>G</div>
            <div>A</div>
            <div>L</div>
            <div>L</div>
            <div>E</div>
          </div>
        </div>
      </div>

      <div className="w-4/12 flex flex-col justify-between ">
        <div className="h-8/12 border object-contain">
          <PortraitImageCard
            src="https://res.cloudinary.com/dxjys4qpi/image/upload/v1757757697/Lerin%27s%20Portfolio/Client%204%20%28Apo%20Drive%29/MIN/LIGHT_1_lo7lte_tbthzk.avif"
            alt="Landscape gallery image"
          />
        </div>

        <div className="bg-black items-center justify-center flex h-4/12 ">
          <div
            onClick={() => {
              setIsGalleryDisplayScreenActive(false);
            }}
            className="text-white"
          >
            <span>{`(`}</span> ready <span>{`)`}</span>
          </div>
        </div>
      </div>

      {/* <button
        type="button"
        onClick={() => {
          setIsGalleryDisplayScreenActive(false);
        }}
        className="absolute bottom-8 right-8 rounded-full bg-black px-4 py-2 text-sm font-medium text-white"
      >
        Close gallery
      </button> */}
    </div>
  );
};

export default DisplayScreen2;
