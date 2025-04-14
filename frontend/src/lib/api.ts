import { treaty } from "@elysiajs/eden";
import type { App } from "@evaly/backend";

export const $api = treaty<App>(process.env.NEXT_PUBLIC_API_URL!, {
  fetch: {
    credentials: "include",
  },
});