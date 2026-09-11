"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { usePathname } from "next/navigation";

export type ApproximateScreenSizeRatio = "16:9" | "1:1" | "9:16";

export type ScreenSize = {
  width: number;
  height: number;
  screenSizeRatio: number;
  approximateScreenSizeRatio: ApproximateScreenSizeRatio;
  isSmall: boolean;
  isMedium: boolean;
  isLarge: boolean;
};

export type ScreenSizeHistory = {
  previous: ScreenSize;
  current: ScreenSize;
};

export type MousePosition = {
  x: number;
  y: number;
};

export type CanUserSkipAnimationState = {
  letUserSkip: boolean;
  count: number;
};

export type UtilityContextValue = {
  screenSize: ScreenSize;
  screenSizeHistory: ScreenSizeHistory;
  mousePosition: MousePosition;
  isCanUserSkipAnimation: CanUserSkipAnimationState;
  isOpeningSequence: boolean;
  setIsOpeningSequence: Dispatch<SetStateAction<boolean>>;
  currentSection: string | null;
  scrollHeight: number;
  isScrollLocked: boolean;
  virtualScrollDistance: number;
  isGalleryDisplayScreenActive: boolean;
  setIsGalleryDisplayScreenActive: Dispatch<SetStateAction<boolean>>;
  nextRoute: string | null;
  getNextRoute: (currentPath: string, routes: string[]) => string | null;
  isUnloadLoader: boolean;
  setIsUnloadLoader: Dispatch<SetStateAction<boolean>>;
  isPhone: boolean;
};

type UtilityProviderProps = {
  children: ReactNode;
  routes?: string[];
};

const UtilityContext = createContext<UtilityContextValue | undefined>(
  undefined,
);

export function getScreenSize(): ScreenSize {
  const width = typeof window !== "undefined" ? window.innerWidth : 0;
  const height = typeof window !== "undefined" ? window.innerHeight : 0;
  const screenSizeRatio = height > 0 ? width / height : 0;

  const approximateScreenSizeRatio: ApproximateScreenSizeRatio =
    height <= 0
      ? "16:9"
      : (() => {
          const candidates: Array<{
            label: ApproximateScreenSizeRatio;
            value: number;
          }> = [
            { label: "16:9", value: 16 / 9 },
            { label: "1:1", value: 1 },
            { label: "9:16", value: 9 / 16 },
          ];

          return candidates.reduce((closest, candidate) => {
            const currentDifference = Math.abs(
              screenSizeRatio - candidate.value,
            );
            const closestDifference = Math.abs(screenSizeRatio - closest.value);

            return currentDifference < closestDifference ? candidate : closest;
          }).label;
        })();

  return {
    width,
    height,
    screenSizeRatio,
    approximateScreenSizeRatio,
    isSmall: width < 768,
    isMedium: width >= 768 && width < 1280,
    isLarge: width >= 1280,
  };
}

export function getNextRoute(
  currentPath: string,
  routes: string[],
): string | null {
  const index = routes.indexOf(currentPath);
  return index >= 0 && index < routes.length - 1 ? routes[index + 1] : null;
}

// user-agent/touch based phone detection, never viewport size (which can be resized on desktop)
export function detectIsPhone(): boolean {
  if (typeof navigator === "undefined") return false;

  const uaData = (navigator as { userAgentData?: { mobile?: boolean } })
    .userAgentData;

  if (uaData && typeof uaData.mobile === "boolean") {
    return uaData.mobile;
  }

  const userAgent = navigator.userAgent || "";
  const isMobileUserAgent =
    /Android.*Mobile|iPhone|iPod|Windows Phone|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent,
    );
  const isCoarsePointer =
    typeof window !== "undefined" &&
    window.matchMedia?.("(pointer: coarse)").matches;

  return isMobileUserAgent && !!isCoarsePointer;
}

export function UtilityProvider({
  children,
  routes = [],
}: UtilityProviderProps) {
  const [screenSizeHistory, setScreenSizeHistory] =
    useState<ScreenSizeHistory>(() => {
      const initialScreenSize = getScreenSize();

      return {
        previous: initialScreenSize,
        current: initialScreenSize,
      };
    });
  const scrollLockHeight = 50;
  const scrollUnlockDistance = 200;
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });
  const [isCanUserSkipAnimation, setIsCanUserSkipAnimation] =
    useState<CanUserSkipAnimationState>({
      letUserSkip: false,
      count: 0,
    });
  const [isOpeningSequence, setIsOpeningSequence] = useState(false);
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [isScrollLocked, setIsScrollLocked] = useState(false);
  const [virtualScrollDistance, setVirtualScrollDistance] = useState(0);
  const [isGalleryDisplayScreenActive, setIsGalleryDisplayScreenActive] =
    useState(true);
  const [isUnloadLoader, setIsUnloadLoader] = useState(false);
  const [isReveal, setisReveal] = useState();
  const [isPhone] = useState<boolean>(() => detectIsPhone());
  const pathname = usePathname();
  const isScrollLockedRef = useRef(isScrollLocked);
  const virtualScrollDistanceRef = useRef(virtualScrollDistance);

  useEffect(() => {
    isScrollLockedRef.current = isScrollLocked;
  }, [isScrollLocked]);

  useEffect(() => {
    virtualScrollDistanceRef.current = virtualScrollDistance;
  }, [virtualScrollDistance]);

  useEffect(() => {
    setTimeout(() => {
      if (isOpeningSequence) {
        setIsUnloadLoader(true);
      }
    }, 3000);
    // setIsUnloadLoader(true);
  }, [isOpeningSequence]);

  useEffect(() => {
    const handleResize = () => {
      setScreenSizeHistory((previousHistory) => ({
        previous: previousHistory.current,
        current: getScreenSize(),
      }));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const updateCurrentSection = (anchorY: number) => {
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>("section[data-section]"),
      );

      const activeSection = sections.find((element) => {
        const rect = element.getBoundingClientRect();

        return anchorY >= rect.top && anchorY <= rect.bottom;
      });

      const nextSection = activeSection?.dataset.section ?? null;
      setCurrentSection((previousSection) =>
        previousSection === nextSection ? previousSection : nextSection,
      );
    };

    const scrollContainer = document.querySelector<HTMLElement>(
      "[data-scroll-container]",
    );

    const enterScrollLock = () => {
      isScrollLockedRef.current = true;
      setIsScrollLocked(true);
      virtualScrollDistanceRef.current = 0;
      setVirtualScrollDistance(0);

      if (scrollContainer) {
        scrollContainer.scrollTop = scrollLockHeight;
      }

      setScrollHeight(scrollLockHeight);
      updateCurrentSection(window.innerHeight / 2);
    };

    const exitScrollLock = () => {
      isScrollLockedRef.current = false;
      setIsScrollLocked(false);
      virtualScrollDistanceRef.current = 0;
      setVirtualScrollDistance(0);
      setScrollHeight(scrollLockHeight + scrollUnlockDistance);

      if (scrollContainer) {
        scrollContainer.scrollTop = scrollLockHeight + scrollUnlockDistance;
      }

      updateCurrentSection(window.innerHeight / 2);
    };

    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: event.clientX,
        y: event.clientY,
      });

      updateCurrentSection(event.clientY);
    };

    const handleWheel = (event: WheelEvent) => {
      if (!isScrollLockedRef.current) {
        return;
      }

      event.preventDefault();

      const nextVirtualDistance =
        virtualScrollDistanceRef.current + Math.abs(event.deltaY);

      // if (nextVirtualDistance >= scrollUnlockDistance) {
      //   exitScrollLock();
      //   return;
      // }

      virtualScrollDistanceRef.current = nextVirtualDistance;

      if (nextVirtualDistance <= scrollUnlockDistance) {
        setVirtualScrollDistance(nextVirtualDistance);
      }

      setScrollHeight(scrollLockHeight + nextVirtualDistance);
    };

    const handleScroll = () => {
      const nextScrollHeight = scrollContainer?.scrollTop ?? window.scrollY;

      // if( scrollContainer?.scrollTop ?? window.scrollY >= scrollUnlockDistance) {

      // }else{
      // const nextScrollHeight = scrollContainer?.scrollTop ?? window.scrollY;
      // }

      console.log(
        nextScrollHeight,
        "nextScrollHeight...maybe a better name than this",
      );

      // TRIGGER SCROLL LOCK TO BEGIN CH2 and CH1 FADE OUT SHENANIGANS
      if (!isScrollLockedRef.current && nextScrollHeight >= scrollLockHeight) {
        // enterScrollLock();
        return;
      } // TRIGGER SCROLL LOCK TO BEGIN CH2 and CH1 FADE OUT SHENANIGANS

      // if (isScrollLockedRef.current) {
      //   setScrollHeight(scrollLockHeight + virtualScrollDistanceRef.current);
      //   if (scrollContainer) {
      //     scrollContainer.scrollTop = scrollLockHeight;
      //   }
      //   return;
      // }

      setScrollHeight(nextScrollHeight);
      updateCurrentSection(window.innerHeight / 2);
    };

    window.addEventListener("mousemove", handleMouseMove);
    scrollContainer?.addEventListener("scroll", handleScroll, {
      passive: true,
    });
    scrollContainer?.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    handleScroll();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      scrollContainer?.removeEventListener("scroll", handleScroll);
      scrollContainer?.removeEventListener("wheel", handleWheel);
    };
  }, []);

  // useEffect(() => {
  //   const interval = window.setInterval(() => {
  //     setIsCanUserSkipAnimation((previousState) => {
  //       if (previousState.letUserSkip) {
  //         return previousState;
  //       }

  //       const nextCount = previousState.count + 1;

  //       return {
  //         count: nextCount,
  //         letUserSkip: nextCount >= 4,
  //       };
  //     });
  //   }, 500);

  //   return () => window.clearInterval(interval);
  // }, []);

  const nextRoute = useMemo(
    () => getNextRoute(pathname, routes),
    [pathname, routes],
  );

  const value = useMemo<UtilityContextValue>(
    () => ({
      screenSize: screenSizeHistory.current,
      screenSizeHistory,
      mousePosition,
      isCanUserSkipAnimation,
      isOpeningSequence,
      setIsOpeningSequence,
      currentSection,
      scrollHeight,
      isScrollLocked,
      virtualScrollDistance,
      isGalleryDisplayScreenActive,
      setIsGalleryDisplayScreenActive,
      nextRoute,
      getNextRoute,
      isUnloadLoader,
      setIsUnloadLoader,
      isPhone,
    }),
    [
      currentSection,
      isCanUserSkipAnimation,
      isOpeningSequence,
      isScrollLocked,
      scrollHeight,
      virtualScrollDistance,
      isGalleryDisplayScreenActive,
      mousePosition,
      nextRoute,
      isUnloadLoader,
      screenSizeHistory,
      isPhone,
    ],
  );

  return (
    <UtilityContext.Provider value={value}>{children}</UtilityContext.Provider>
  );
}

export function useUtilityContext(): UtilityContextValue {
  const context = useContext(UtilityContext);

  if (!context) {
    throw new Error("useUtilityContext must be used within a UtilityProvider");
  }

  return context;
}
