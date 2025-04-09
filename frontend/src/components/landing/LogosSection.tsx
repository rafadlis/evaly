"use client"
import { motion } from "motion/react";
import { useTranslations } from 'next-intl';

const MotionDiv = motion.div;

export const LogosSection = () => {
  const t = useTranslations('HomePage');
  
  const logoKeys = ['logo1', 'logo2', 'logo3', 'logo4', 'logo5'];
  
  return (
    <section className="py-8 border-y border-border/40">
      <div className="container">
        <div className="text-center text-sm text-muted-foreground mb-6">
          {t('logos.title')}
        </div>
        <div className="flex flex-wrap justify-between items-center gap-4">
          {logoKeys.map((key, i) => (
            <MotionDiv
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-muted-foreground/70 font-medium"
            >
              {t(`logos.${key}`)}
            </MotionDiv>
          ))}
        </div>
      </div>
    </section>
  );
}; 