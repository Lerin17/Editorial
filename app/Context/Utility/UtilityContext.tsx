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
  mousePosition: MousePosition;
  isCanUserSkipAnimation: CanUserSkipAnimationState;
  isOpeningSequence: boolean;
  setIsOpeningSequence: Dispatch<SetStateAction<boolean>>;
  currentSection: string | null;
  isGalleryDisplayScreenActive: boolean;
  setIsGalleryDisplayScreenActive: Dispatch<SetStateAction<boolean>>;
  nextRoute: string | null;
  getNextRoute: (currentPath: string, routes: string[]) => string | null;
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

export function UtilityProvider({
  children,
  routes = [],
}: UtilityProviderProps) {
  const screenSizeRef = useRef<ScreenSize>(getScreenSize());
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
  const [isGalleryDisplayScreenActive, setIsGalleryDisplayScreenActive] =
    useState(true);
  const [isReveal, setisReveal] = useState();
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      Object.assign(screenSizeRef.current, getScreenSize());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: event.clientX,
        y: event.clientY,
      });

      const sections = Array.from(
        document.querySelectorAll<HTMLElement>("section[data-section]"),
      );

      const pointerY = window.scrollY + event.clientY;
      const activeSection = sections.find((element) => {
        const rect = element.getBoundingClientRect();
        const top = window.scrollY + rect.top;
        const bottom = window.scrollY + rect.bottom;

        return pointerY >= top && pointerY <= bottom;
      });

      const nextSection = activeSection?.dataset.section ?? null;
      setCurrentSection((previousSection) =>
        previousSection === nextSection ? previousSection : nextSection,
      );
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIsCanUserSkipAnimation((previousState) => {
        if (previousState.letUserSkip) {
          return previousState;
        }

        const nextCount = previousState.count + 1;

        return {
          count: nextCount,
          letUserSkip: nextCount >= 4,
        };
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const nextRoute = useMemo(
    () => getNextRoute(pathname, routes),
    [pathname, routes],
  );

  const value = useMemo<UtilityContextValue>(
    () => ({
      screenSize: screenSizeRef.current,
      mousePosition,
      isCanUserSkipAnimation,
      isOpeningSequence,
      setIsOpeningSequence,
      currentSection,
      isGalleryDisplayScreenActive,
      setIsGalleryDisplayScreenActive,
      nextRoute,
      getNextRoute,
    }),
    [
      currentSection,
      isCanUserSkipAnimation,
      isOpeningSequence,
      isGalleryDisplayScreenActive,
      mousePosition,
      nextRoute,
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
