"use client"

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from "@tanstack/react-query";
import superjson from "superjson";

let clientQueryClientSingleton: QueryClient;

const TanstackQueryProvider = ({ children }: { children: React.ReactNode }) => {
   // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();

  return (
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
  );
}

export function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient();
  }
  // Browser: use singleton pattern to keep the same query client
  return (clientQueryClientSingleton ??= makeQueryClient());
}

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retryDelay:1,
        retry: 0,
        /* this configuration was refer to this: https://tanstack.com/query/v4/docs/framework/react/guides/query-invalidation
         * The time in milliseconds after data is considered stale.
         * If set to `Infinity`, the data will never be considered stale.
         * If set to a function, the function will be executed with the query to compute a `staleTime`.
         * Don't set it to 0, unless you want to disable the cache entirely. and it will accidently make the request doubled */
        staleTime: 0, // 0 seconds, will help to reduce the number of requests, its good for SSR
        /**
         * The time in milliseconds that unused/inactive cache data remains in memory.
         * When a query's cache becomes unused or inactive, that cache data will be garbage collected after this duration.
         * When different garbage collection times are specified, the longest one will be used.
         * Setting it to `Infinity` will disable garbage collection.
         */
        gcTime: Infinity,
      },
      dehydrate: {
        serializeData: superjson.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
      hydrate: {
        deserializeData: superjson.deserialize,
      },
    },
  });
}

export default TanstackQueryProvider