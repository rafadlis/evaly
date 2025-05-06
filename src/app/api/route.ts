import { NextResponse } from "next/server";

export async function GET() {
  console.log(process.env.REGION)
  return NextResponse.json(process.env);
}
