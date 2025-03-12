import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

// Import our components
import { Hero } from "@/components/landing/Hero";
import { LogosSection } from "@/components/landing/LogosSection";
import { FeatureTabs } from "@/components/landing/FeatureTabs";
import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";
import { LogoType } from "@/components/shared/logo";
import ThemeToggle from "@/components/shared/theme-toggle";

export const dynamic = "force-static";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navigation */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container flex items-center justify-between py-3">
          <LogoType href="/" />
          <div className="flex items-center gap-4">
            <ThemeToggle />
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
