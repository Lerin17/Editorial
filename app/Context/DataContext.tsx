"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
// import sanityClient from "../../sanity/client";

type DataRecord = Record<string, unknown> | null;

type DataContextValue = {
  data: DataRecord;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

type DataProviderProps = {
  children: ReactNode;
};

const DATA_QUERY = `*[_type == "siteSettings"][0]`;
const placeholderProjectId = "your-project-id";
const placeholderDataset = "production";

const DataContext = createContext<DataContextValue | undefined>(undefined);

export function DataProvider({ children }: DataProviderProps) {
  const [data, setData] = useState<DataRecord>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // const fetchData = useCallback(async () => {
  //   const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  //   const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  //   const isSanityConfigured =
  //     Boolean(projectId) &&
  //     projectId !== placeholderProjectId &&
  //     Boolean(dataset) &&
  //     dataset !== placeholderDataset;

  //   setLoading(true);
  //   setError(null);

  //   if (!isSanityConfigured) {
  //     setData(null);
  //     setError(
  //       "Sanity is not configured yet. Add a real NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET in .env.local.",
  //     );
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     const result = await sanityClient.fetch<DataRecord>(DATA_QUERY);
  //     setData(result);
  //   } catch (caughtError) {
  //     setData(null);
  //     setError(
  //       caughtError instanceof Error
  //         ? caughtError.message
  //         : "Failed to fetch data from Sanity.",
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  // useEffect(() => {
  //   void fetchData();
  // }, [fetchData]);

  // const value = useMemo<DataContextValue>(
  //   () => ({
  //     data,
  //     loading,
  //     error,
  //     refetch: fetchData,
  //   }),
  //   [data, loading, error, fetchData],
  // );

  return (
    <DataContext.Provider
      value={{
        data,
        loading,
        error,
        refetch: async () => {
          // refetch is disabled because fetchData is commented out
        },
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useDataContext() {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error("useDataContext must be used within a DataProvider");
  }

  return context;
}
