import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  const env = process;
  // show all env variables
  return NextResponse.json({
    env,
    cf: request.cf,
  });
};
