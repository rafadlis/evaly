import { useQueryState } from "nuqs";

export function useSelectedSession() {
  return useQueryState("selected-session");
}
