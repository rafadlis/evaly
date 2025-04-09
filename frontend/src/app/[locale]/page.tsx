import { Button } from "@/components/ui/button";

// Import our components
import { Hero } from "@/components/landing/Hero";
import { LogosSection } from "@/components/landing/LogosSection";
import { FeatureTabs } from "@/components/landing/FeatureTabs";
import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";
import { LogoType } from "@/components/shared/logo";
import ThemeToggle from "@/components/shared/theme-toggle";
import { Link } from "@/components/shared/progress-bar";
import { useTranslations } from "next-intl";
import DialogSelectLanguage from "@/components/shared/dialog/dialog-select-language";

export const dynamic = "force-static"

export default function HomePage() {
  const t = useTranslations('HomePage');
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-background">
        <div className="flex items-center justify-between py-3 px-3 md:px-6">
          <LogoType href="/" />
          <div className="flex items-center gap-4">
            <DialogSelectLanguage />
            <ThemeToggle />
            <Link href="/dashboard">
              <Button size="sm" variant="default">
                {t('dashboard')}
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
