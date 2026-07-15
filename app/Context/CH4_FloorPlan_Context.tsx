"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

type CH4FloorPlanContextValue = {
  isFloorPlanMenuOpen: boolean;
  setIsFloorPlanMenuOpen: Dispatch<SetStateAction<boolean>>;
};

type CH4FloorPlanProviderProps = {
  children: ReactNode;
};

const CH4FloorPlanContext = createContext<CH4FloorPlanContextValue | undefined>(
  undefined,
);

export function CH4FloorPlanProvider({ children }: CH4FloorPlanProviderProps) {
  const [isFloorPlanMenuOpen, setIsFloorPlanMenuOpen] = useState(false);

  const value = useMemo<CH4FloorPlanContextValue>(
    () => ({
      isFloorPlanMenuOpen,
      setIsFloorPlanMenuOpen,
    }),
    [isFloorPlanMenuOpen],
  );

  return (
    <CH4FloorPlanContext.Provider value={value}>
      {children}
    </CH4FloorPlanContext.Provider>
  );
}

export function useCH4FloorPlanContext() {
  const context = useContext(CH4FloorPlanContext);

  if (!context) {
    throw new Error(
      "useCH4FloorPlanContext must be used within a CH4FloorPlanProvider",
    );
  }

  return context;
}
