import { LogoType } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Link } from "@/components/shared/progress-bar";
import { Github, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import DialogSelectLanguage from "@/components/shared/dialog/dialog-select-language";

export function PublicHeader() {
  const t = useTranslations("HomePage");
  const landing = useTranslations("LandingPage");

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border/10">
      <div className="flex items-center justify-between py-3 container">
        <LogoType href="/" />

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          <Link href="/schools">
            <Button variant="ghost">{landing("forSchools")}</Button>
          </Link>
          <Link href="/companies">
            <Button variant="ghost">{landing("forCompanies")}</Button>
          </Link>
          <Link href="/pricing" className="mr-4">
            <Button variant="ghost">{landing("pricing")}</Button>
          </Link>
          <a
            href="https://github.com/fahreziadh/evaly"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline">
              <Github className="mr-2 h-4 w-4" />
              {t("openSource")}
            </Button>
          </a>
          <DialogSelectLanguage />
          <Link href="/dashboard">
            <Button variant="default">{t("dashboard")}</Button>
          </Link>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-3">
          <Link href="/dashboard" className="mr-1">
            <Button variant="default" size="sm">
              {t("dashboard")}
            </Button>
          </Link>
          <DialogSelectLanguage />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-4">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center">
                  <LogoType href="/" />
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                </div>

                <nav className="flex flex-col gap-1 mt-6">
                  <Link href="/schools">
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-12 text-base"
                    >
                      {landing("forSchools")}
                    </Button>
                  </Link>
                  <Link href="/companies">
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-12 text-base"
                    >
                      {landing("forCompanies")}
                    </Button>
                  </Link>
                  <Link href="/pricing">
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-12 text-base"
                    >
                      {landing("pricing")}
                    </Button>
                  </Link>
                  <div className="mt-2">
                    <a
                      href="https://github.com/fahreziadh/evaly"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button
                        variant="outline"
                        className="w-full justify-start mt-2"
                      >
                        <Github className="mr-2 h-4 w-4" />
                        {t("openSource")}
                      </Button>
                    </a>
                  </div>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
