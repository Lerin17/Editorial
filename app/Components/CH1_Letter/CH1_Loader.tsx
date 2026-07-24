import { useUtilityContext } from "@/app/Context/Utility";
import React from "react";

const LoaderComponent = () => <div>...Loading</div>;

const StylizedCursor = () => {
  const { screenSize } = useUtilityContext();

  const positionX = screenSize.width * 0.1;
  const positionY = screenSize.height * 0.1;

  const [beginTyping, setbeginTyping] = React.useState({
    cursor: false,
  });

  React.useEffect(() => {
    setTimeout(() => {
      setbeginTyping((prev) => ({
        ...prev,
        cursor: true,
      }));
    }, 2000);
  }, []);

  return (
    <div
      style={{
        left: positionX,
        top: positionY,
        width: screenSize.width - 200,
      }}

      className="flex  absolute"
    >
      <div className="text-4xl font-archivo flex relative w-full ">
        <div className="z-10 absolute ">
          {/* Wumba Development is a thoughtfully planned residential */}
        </div>

        {beginTyping.cursor && (
          <div className="animate-pulse bg-white text-white w-12 h-12 animate-fade absolute z-0 left-0">
            x
          </div>
        )}
      </div>
    </div>
  );
};

const CH1_Loader = () => {
  // console.log(screenSize, "screenSize");

  return (
    <div className="h-screen w-screen relative bg-black relative">
      <StylizedCursor />

      {/* <div className="w-full h-full flex justify-center items-center">
        <div className="flex  w-5/12  text-white ">
          <div>
            Wumba Development is a thoughtfully planned residential community in
            Wumba District, Cadastral Zone C10, Abuja, designed to offer modern
            family living within a secure and well-organized environment. Set
            across approximately 7.93 hectares, the estate brings together a
            diverse mix of terrace houses and duplexes, complemented by
            recreational spaces, retail facilities, and supporting
            infrastructure. The master plan balances housing, amenities, and
            open spaces to create a vibrant neighborhood where residents can
            live, connect, and thrive.
          </div>
        </div>
      </div> */}

      {/* <div className="absolute z-10 bottom-10">
        <LoaderComponent />
      </div> */}
    </div>
  );
};

export default CH1_Loader;
