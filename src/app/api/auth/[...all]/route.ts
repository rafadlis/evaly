import { auth } from "@/lib/auth"; // path to your auth file
import { toNextJsHandler } from "better-auth/next-js";
 
// Disallow body parsing, we will parse it manually
export const config = { api: { bodyParser: false } }
 
export const { POST, GET } = toNextJsHandler(auth);