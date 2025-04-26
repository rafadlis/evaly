import db from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    env: process.env,
    testDb: await db.query.user.findFirst()
  });
};