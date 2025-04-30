"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { Github } from "lucide-react";
import { motion } from "motion/react";
import { Badge } from "../ui/badge";
import { useTranslations } from "next-intl";

const MotionDiv = motion.div;

export const Hero = () => {
  const t = useTranslations("HomePage");

  return (
    <section className=" flex flex-col items-center justify-center container max-w-3xl relative overflow-hidden h-[calc(100vh-56px)]">
      <MotionDiv>
        <Link href="https://github.com/fahreziadh/evaly" target="_blank">
          <Button variant={"secondary"} className="p-1 h-max mb-2">
            <Badge>
              {t("hero.badge")}
              <Github />
            </Badge>
            <div className="h-1 w-1 bg-border hidden sm:block"></div>
            <div className="text-muted-foreground sm:block hidden mr-3">
              {t("hero.openSource")}
            </div>
          </Button>
        </Link>

        <h1 className="text-balance text-3xl md:text-5xl lg:text-6xl font-semibold mb-6 mt-6 max-w-3xl">
          {t("hero.title")}
        </h1>

        <p className="mb-8 max-w-2xl md:text-lg text-primary/80">
          {t("hero.subtitle")}
        </p>

        <div className="flex flex-wrap gap-4">
          <Link href="/dashboard">
            <Button size="lg" className="text-lg font-bold">{t("hero.getStarted")}</Button>
          </Link>
          {/* <Link href="#">
            <Button variant="outline" size="lg">
              {t("hero.watchDemo")}
            </Button>
          </Link> */}
        </div>
      </MotionDiv>
    </section>
  );
};
