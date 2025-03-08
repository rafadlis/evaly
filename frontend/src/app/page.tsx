"use client"
import { Link } from "@/components/shared/progress-bar";
import { env } from "@/lib/env";

export default  function Home() {
 
  return (
    <div className="">
      {JSON.stringify(env.NEXT_PUBLIC_API_URL)}
      <Link href="/dashboard">Dashboard</Link>
    </div>
  );
}
