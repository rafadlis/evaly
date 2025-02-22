import { parseAsString, useQueryState } from "nuqs";

export function useTabsState() {
  return useQueryState("tabs", parseAsString.withDefault("questions"));
}
