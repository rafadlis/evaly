import { Button } from "@/components/ui/button";
import { Footer } from "@/components/landing/Footer";
import { useTranslations } from "next-intl";
import { Link } from "@/components/shared/progress-bar";
import { PublicHeader } from "../_components/PublicHeader";
import { Badge } from "@/components/ui/badge";
import { Github } from "lucide-react";

export const dynamic = "force-static";

export default function ComingSoonPage() {
  const t = useTranslations("ComingSoonPage");
  const homePage = useTranslations("HomePage");

  return (
    <div className="flex flex-col min-h-svh bg-background">
      <PublicHeader />
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-balance text-3xl md:text-5xl lg:text-6xl font-semibold mb-6 mt-6 max-w-3xl">
          {t("title", { defaultValue: "Coming Soon!" })}
        </h1>
        <Link href="https://github.com/fahreziadh/evaly" target="_blank">
          <Button variant={"secondary"} className="p-1 h-max mb-2">
            <Badge>
              {homePage("hero.badge")}
              <Github />
            </Badge>
            <div className="h-1 w-1 bg-border hidden sm:block"></div>
            <div className="text-muted-foreground sm:block hidden mr-3">
              {homePage("hero.openSource")}
            </div>
          </Button>
        </Link>
        {/* <Link href="/">
          <Button variant="outline">
            {t("backToHome", { defaultValue: "Back to Home" })}
          </Button>
        </Link> */}
      </main>
      <Footer />
    </div>
  );
}
