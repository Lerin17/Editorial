"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";

type DataContextValue = {
  data: null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

type DataProviderProps = {
  children: ReactNode;
};

const DataContext = createContext<DataContextValue | undefined>(undefined);

export function DataProvider({ children }: DataProviderProps) {
  const value = useMemo<DataContextValue>(
    () => ({
      data: null,
      loading: false,
      error: null,
      refetch: async () => {},
    }),
    [],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useDataContext() {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error("useDataContext must be used within a DataProvider");
  }

  return context;
}
