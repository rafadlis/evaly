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
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute right-0 top-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-[120px]"></div>
        <div className="absolute left-0 bottom-1/4 w-96 h-96 bg-foreground/5 rounded-full filter blur-[120px]"></div>
      </div>

      <div className="container max-w-3xl">
        {/* Content */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl text-center mx-auto flex flex-col items-center"
        >
          <Button
            variant={"outline"}
            className="p-1 pr-3 rounded-full h-max mb-2"
          >
            <Badge>
              {t('hero.badge')}
              <Wand2 />
            </Badge>
            <div className="h-1 w-1 rounded-full bg-border"></div>
            <div className="text-xs text-muted-foreground">
              {t('hero.title')}
            </div>
          </Button>

          <h1 className="text-balance text-4xl font-bold mb-4 mt-4">
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
