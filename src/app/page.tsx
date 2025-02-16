import { Button } from "@/components/ui/button";
import { serverClient } from "@/trpc/server.client";

export const revalidate = 10

export default async function Home() {
  const getHello = await serverClient.hello()

  return (
    <div className="">
      <Button>Test 123</Button>
      {JSON.stringify(getHello)}
    </div>
  );
}
