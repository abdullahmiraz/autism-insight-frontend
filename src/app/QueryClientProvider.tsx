"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

// Initialize React Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
      retry: 1, // Retry failed queries once
    },
    mutations: {
      retry: 0, // Don't retry failed mutations
    },
  },
});

interface QueryProviderProps {
  children: ReactNode;
}

const QueryClientWrapper = ({ children }: QueryProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryClientWrapper;
