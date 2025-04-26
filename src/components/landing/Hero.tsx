"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { Wand2 } from "lucide-react";
import { motion } from "motion/react";
import { Badge } from "../ui/badge";
import { useTranslations } from 'next-intl';

const MotionDiv = motion.div;

export const Hero = () => {
  const t = useTranslations('HomePage');
  
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container max-w-3xl">
        {/* Content */}
        <MotionDiv
          className="max-w-4xl text-center mx-auto flex flex-col items-center"
        >
          <Button
            variant={"outline"}
            className="p-1 pr-3  h-max mb-2"
          >
            <Badge>
              {t('hero.badge')}
              <Wand2 />
            </Badge>
            <div className="h-1 w-1 bg-border"></div>
            <div className="text-xs text-muted-foreground">
              {t('hero.title')}
            </div>
          </Button>

          <h1 className="text-balance text-3xl md:text-5xl lg:text-6xl font-medium mb-6 mt-6 font-serif">
            {t('hero.heading')}
          </h1>

          <p className="mb-8 max-w-2xl text-primary/80">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/auth/register">
              <Button size="lg">
                {t('hero.getStarted')}
              </Button>
            </Link>
            <Link href="#">
              <Button variant="outline" size="lg">
                {t('hero.watchDemo')}
              </Button>
            </Link>
          </div>

          <div className="mt-12 flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-10 w-10 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-xs font-medium shadow-sm"
                >
                  {i}
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">1000+</span> {t('hero.trustText')}
            </p>
          </div>
        </MotionDiv>
      </div>
    </section>
  );
};
