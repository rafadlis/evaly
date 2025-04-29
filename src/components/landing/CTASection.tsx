"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { ArrowRight, TwitterIcon } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from 'next-intl';

const MotionDiv = motion.div;

export const CTASection = () => {
  const t = useTranslations('HomePage.cta');
  
  return (
    <section className="py-20 bg-foreground/[0.02] relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.015] pointer-events-none"></div>
      <div className="container text-center">
        <MotionDiv 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="bg-background p-8 rounded-2xl shadow-sm border border-border/40">
            <h2 className="text-2xl font-bold mb-3">{t('title')}</h2>
            <p className="text-muted-foreground mb-6 max-w-[600px] mx-auto">
              {t('subtitle')}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="https://evaly.io/dashboard">
                <Button variant="default" size="lg" >
                  {t('button')} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="https://x.com/evalyio">
                <Button variant="outline" size="lg">
                  <TwitterIcon />
                  {t('twitter')}
                </Button>
              </Link>
            </div>
          </div>
        </MotionDiv>
      </div>
    </section>
  );
}; 