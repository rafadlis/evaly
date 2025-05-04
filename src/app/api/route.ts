import db from "@/lib/db";

export async function GET() {
    const testDB = await db.query.user.findMany()
  return new Response(JSON.stringify({env: process.env, testDB}));
}
