import { useQueryState, parseAsInteger } from "nuqs";

export function useSelectedSession(){
    return useQueryState(
        "selected-session",
        parseAsInteger.withDefault(1)
      );
    
}