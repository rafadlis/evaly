import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const GET = async () => {
  const cf = getCloudflareContext()
  // show all env variables
  return NextResponse.json(cf);
};
