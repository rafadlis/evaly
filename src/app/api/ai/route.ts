import { trpc } from "@/trpc/trpc.server";
import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json(await trpc.organization.profile());
};
