import { NextResponse } from "next/server";

export const GET = async () => {
  const env = process.env;
  // show all env variables
  return NextResponse.json(env);
};
