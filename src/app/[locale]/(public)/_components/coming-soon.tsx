import { Footer } from "@/components/landing/Footer";
import { PublicHeader } from "./public-header";
import ComingSoon from "@/components/shared/coming-soon";

export default function ComingSoonPage() {

  return (
    <div className="flex flex-col min-h-svh bg-background">
      <PublicHeader />
      <ComingSoon />
      <Footer />
    </div>
  );
}
