import { Button } from "@/components/ui/button";
import Link from "next/link";

// Import our components
import { Hero } from "@/components/landing/Hero";
import { LogosSection } from "@/components/landing/LogosSection";
import { FeatureTabs } from "@/components/landing/FeatureTabs";
import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

export const dynamic = "force-static";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navigation */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container flex items-center justify-between py-3">
          <Link href="/dashboard" className="flex items-center">
            <div className="h-7 w-7 text-lg bg-background text-foreground flex items-center justify-center font-bold mr-3 shadow-[3px_3px_0px_0px_var(--primary)] hover:shadow-[0px_0px_0px_0px_var(--primary)] border-2 border-primary transition-all">
              E
            </div>
            <span className="text-2xl font-bold hidden sm:block">
              evaly
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button size="sm" variant="default">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Hero />
        <LogosSection />
        <FeatureTabs />
        <BenefitsSection />
        <CTASection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
