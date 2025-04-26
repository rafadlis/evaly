import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from "@tanstack/react-query";
import superjson from "superjson";
  
  export function makeQueryClient() {
    return new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 1s, 2s, 4s, 8s, 16s, 30s
          retry: (failureCount, error) => {
            if (error?.message === "UNAUTHORIZED") {
              return false;
            }
            
            if (failureCount >= 3) {
              return false;
            }
           
            return true;
          },
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