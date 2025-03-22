import { treaty } from "@elysiajs/eden";
import { App } from "..";
import { env } from "./env";

export const $api = treaty<App>(env.API_URL, {
  fetch: {
    credentials: "include",
  },
});
