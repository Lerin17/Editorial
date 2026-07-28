import { useUtilityContext } from "@/app/Context/Utility";
import React from "react";
import { AnimatePresence, motion, number } from "framer-motion";
const LoaderComponent = () => <div>...Loading</div>;

const red = ["Netconstrct Limited", "The Vale Homes Wumba", "2026"];

const AnimatedTextBox = () => {
  return <motion.div></motion.div>;
};

const BlinkingCursor = () => {
  const { screenSize } = useUtilityContext();

  const positionX = screenSize.width * 0.1;
  const positionY = screenSize.height * 0.15;

  const red = [];

  // red.map(item => {

  // })

  // console.log(delay, "exe");

  return (
    <motion.div
      initial={{
        left: positionX,
        top: positionY,
        width: screenSize.width - 300,
      }}

      className="flex  absolute"
    >
      {/* cursor */}
      <motion.div
        animate={{ opacity: [1, 1, 0, 0, 1] }}
        transition={{
          duration: 0.7,
          repeat: Infinity,
          times: [0, 0.45, 0.5, 0.95, 1],
          ease: "linear",
        }}
        className="text:2xl lg:text-4xl  font-inter flex relative "
      >
        {
          <div className="animate-puls bg-white text-black w-12 h-12 animate-fade flex items-center justify-center text-5xl"></div>
        }
      </motion.div>

      {/* cursor */}
    </motion.div>
  );
};

const StylizedCursor = () => {
  const { screenSize } = useUtilityContext();

  const positionX = screenSize.width * 0.1;
  const positionY = screenSize.height * 0.15;

  const red = [];

  // red.map(item => {

  // })

  const [beginTyping, setbeginTyping] = React.useState({
    cursor: false,
    isBeginTyping: false,
    isBeginAnimation: false,
  });

  const text = "Netconstruct Limited";
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (count >= text.length) return;

    const id = setTimeout(() => {
      setCount(count + 1);
    }, 50);

    return () => clearTimeout(id);
  }, [count]);

  React.useEffect(() => {
    setTimeout(() => {
      setbeginTyping((prev) => ({
        ...prev,
        cursor: true,
      }));
    }, 1000);
  }, []);

  React.useEffect(() => {
    if (beginTyping.cursor) {
      setTimeout(() => {
        setbeginTyping((prev) => ({
          ...prev,
          isBeginTyping: true,
        }));
      }, 1000);
    }
  }, [beginTyping]);

  React.useEffect(() => {
    if (beginTyping.isBeginTyping) {
      setTimeout(() => {
        setbeginTyping((prev) => ({
          ...prev,
          isBeginAnimation: true,
        }));
      }, 1000);
    }
  }, [beginTyping]);

  // console.log(delay, "exe");

  return (
    <motion.div
      initial={{
        left: positionX,
        top: positionY,
        width: screenSize.width - 300,
      }}

      className="flex  absolute"
    >
      {
        <motion.div
          className={`${beginTyping.isBeginTyping ? "" : ""} text-3xl font-archivo  w-fit `}
        >
          {text.split("").map((char, i) => {
            const delay = (40 + Math.random() * 30) / 1000;

            return (
              <AnimatePresence key={i}>
                {i < count && (
                  <motion.span
                    className="h-fit display-inline"
                    key={i}

                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}

                    transition={{
                      duration: 0.02,
                      // delay,
                      ease: "easeOut",
                    }}

                    // animate={{
                    //   display: i < count ? "inline" : "",
                    //   opacity: i < count ? 1 : 0,
                    // }}
                  >
                    {char}
                  </motion.span>
                )}
              </AnimatePresence>
            );
          })}
        </motion.div>
      }

      {/* cursor */}
      <motion.div
        animate={{ opacity: [1, 1, 0, 0, 1] }}
        transition={{
          duration: 1,
          repeat: Infinity,
          times: [0, 0.45, 0.5, 0.95, 1],
          ease: "linear",
          // x: {
          //   delay: 2,
          // },
        }}
        className="text:2xl lg:text-4xl  font-inter flex relative "
      >
        {
          <div className="animate-puls bg-white text-black w-12 h-12 animate-fade flex items-center justify-center text-5xl"></div>
        }
      </motion.div>

      {/* cursor */}
    </motion.div>
  );
};

const StylizedCursor2 = () => {
  const { screenSize } = useUtilityContext();

  const positionX = screenSize.width * 0.1;
  const positionY = screenSize.height * 0.19;

  const red = [];

  // red.map(item => {

  // })

  const [beginTyping, setbeginTyping] = React.useState({
    cursor: false,
    isBeginTyping: false,
    isBeginAnimation: false,
  });

  const text = "The Vale Homes Wumba";
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (count >= text.length) return;

    const id = setTimeout(() => {
      setCount(count + 1);
    }, 50);

    return () => clearTimeout(id);
  }, [count]);

  React.useEffect(() => {
    setTimeout(() => {
      setbeginTyping((prev) => ({
        ...prev,
        cursor: true,
      }));
    }, 1000);
  }, []);

  React.useEffect(() => {
    if (beginTyping.cursor) {
      setTimeout(() => {
        setbeginTyping((prev) => ({
          ...prev,
          isBeginTyping: true,
        }));
      }, 1000);
    }
  }, [beginTyping]);

  React.useEffect(() => {
    if (beginTyping.isBeginTyping) {
      setTimeout(() => {
        setbeginTyping((prev) => ({
          ...prev,
          isBeginAnimation: true,
        }));
      }, 1000);
    }
  }, [beginTyping]);

  // console.log(delay, "exe");

  return (
    <motion.div
      initial={{
        left: positionX,
        top: positionY,
        width: screenSize.width - 300,
      }}

      className="flex  absolute"
    >
      {
        <motion.div
          className={`${beginTyping.isBeginTyping ? "" : ""} text-3xl font-archivo  w-fit `}
        >
          {text.split("").map((char, i) => {
            const delay = (40 + Math.random() * 30) / 1000;

            return (
              <AnimatePresence key={i}>
                {i < count && (
                  <motion.span
                    className="h-fit display-inline"
                    key={i}

                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}

                    transition={{
                      duration: 0.04,
                      // delay,
                      ease: "easeOut",
                    }}

                    // animate={{
                    //   display: i < count ? "inline" : "",
                    //   opacity: i < count ? 1 : 0,
                    // }}
                  >
                    {char}
                  </motion.span>
                )}
              </AnimatePresence>
            );
          })}
        </motion.div>
      }

      {/* cursor */}
      <motion.div
        animate={{ opacity: [1, 1, 0, 0, 1] }}
        transition={{
          duration: 1,
          repeat: Infinity,
          times: [0, 0.45, 0.5, 0.95, 1],
          ease: "linear",
          // x: {
          //   delay: 2,
          // },
        }}
        className="text:2xl lg:text-4xl  font-inter flex relative "
      >
        {
          <div className="animate-puls bg-white text-black w-12 h-12 animate-fade flex items-center justify-center text-5xl"></div>
        }
      </motion.div>

      {/* cursor */}
    </motion.div>
  );
};

const StylizedCursor3 = () => {
  const { screenSize } = useUtilityContext();

  const positionX = screenSize.width * 0.1;
  const positionY = screenSize.height * 0.23;

  const red = [];

  // red.map(item => {

  // })

  const [beginTyping, setbeginTyping] = React.useState({
    cursor: false,
    isBeginTyping: false,
    isBeginAnimation: false,
  });

  const text = "Residential Development";
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (count >= text.length) return;

    const id = setTimeout(() => {
      setCount(count + 1);
    }, 50);

    return () => clearTimeout(id);
  }, [count]);

  React.useEffect(() => {
    setTimeout(() => {
      setbeginTyping((prev) => ({
        ...prev,
        cursor: true,
      }));
    }, 1000);
  }, []);

  React.useEffect(() => {
    if (beginTyping.cursor) {
      setTimeout(() => {
        setbeginTyping((prev) => ({
          ...prev,
          isBeginTyping: true,
        }));
      }, 1000);
    }
  }, [beginTyping]);

  React.useEffect(() => {
    if (beginTyping.isBeginTyping) {
      setTimeout(() => {
        setbeginTyping((prev) => ({
          ...prev,
          isBeginAnimation: true,
        }));
      }, 1000);
    }
  }, [beginTyping]);

  // console.log(delay, "exe");

  return (
    <motion.div
      initial={{
        left: positionX,
        top: positionY,
        width: screenSize.width - 300,
      }}

      className="flex  absolute"
    >
      {
        <motion.div
          className={`${beginTyping.isBeginTyping ? "" : ""} text-3xl font-archivo  w-fit `}
        >
          {text.split("").map((char, i) => {
            const delay = (40 + Math.random() * 30) / 1000;

            return (
              <AnimatePresence key={i}>
                {i < count && (
                  <motion.span
                    className="h-fit display-inline"
                    key={i}

                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}

                    transition={{
                      duration: 0.04,
                      // delay,
                      ease: "easeOut",
                    }}

                    // animate={{
                    //   display: i < count ? "inline" : "",
                    //   opacity: i < count ? 1 : 0,
                    // }}
                  >
                    {char}
                  </motion.span>
                )}
              </AnimatePresence>
            );
          })}
        </motion.div>
      }

      {/* cursor */}
      <motion.div
        animate={{ opacity: [1, 1, 0, 0, 1] }}
        transition={{
          duration: 1,
          repeat: Infinity,
          times: [0, 0.45, 0.5, 0.95, 1],
          ease: "linear",
          // x: {
          //   delay: 2,
          // },
        }}
        className="text:2xl lg:text-4xl  font-inter flex relative "
      >
        {
          <div className="animate-puls bg-white text-black w-12 h-12 animate-fade flex items-center justify-center text-5xl"></div>
        }
      </motion.div>

      {/* cursor */}
    </motion.div>
  );
};

interface ICH1_Loader_props {
  loaderCount: any;
}

const CH1_Loader = (props: ICH1_Loader_props) => {
  // console.log(screenSize, "screenSize");

  const [beginTyping, setbeginTyping] = React.useState({
    cursor: false,
    isBeginTyping: false,
    isBeginAnimation: false,
  });

  const [beginDate, setbeginDate] = React.useState(false);

  const text = "The Vale Homes Wumba";
  //  const [count, setCount] = React.useState(0);

  //  React.useEffect(() => {
  //    if (count >= text.length) return;

  //    const id = setTimeout(() => {
  //      setCount(count + 1);
  //    }, 50);

  //    return () => clearTimeout(id);
  //  }, [count]);

  React.useEffect(() => {
    setTimeout(() => {
      setbeginTyping((prev) => ({
        ...prev,
        cursor: true,
      }));
    }, 500);
  }, []);

  React.useEffect(() => {
    setTimeout(() => {
      setbeginDate(true);
    }, 1400);
  }, [beginTyping.cursor]);

  return (
    <div className="h-screen w-screen relative bg">
      {!beginTyping.cursor ? (
        <BlinkingCursor />
      ) : (
        <div>
          <StylizedCursor />
          {/* <StylizedCursor2 />
          <StylizedCursor3 /> */}
        </div>
      )}

      {/* <StylizedCursor /> */}
      <div>{props.loaderCount}</div>
      {props.loaderCount === 100 && (
        <div className="w-full h-full  flex items-center justify-center">
          <div>Click to Enter</div>
        </div>
      )}

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
