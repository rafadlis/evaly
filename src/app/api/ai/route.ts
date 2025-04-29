import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  // show all env variables
  return NextResponse.json(request.cf);
};
