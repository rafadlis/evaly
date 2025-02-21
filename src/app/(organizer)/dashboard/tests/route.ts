import db from "@/lib/db";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export const GET = async () => {
  const data = await db.query.account.findFirst()
  return NextResponse.json(data)
  return redirect("/dashboard")
};
