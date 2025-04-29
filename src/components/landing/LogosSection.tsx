"use client"
import { motion } from "motion/react";
import { useTranslations } from 'next-intl';

const MotionDiv = motion.div;

export const LogosSection = () => {
  const t = useTranslations('HomePage');
  
  const logoKeys = ['logo1', 'logo2', 'logo3', 'logo4', 'logo5'];
  
  return (
      <div className="container">
        <div className="text-center mb-6">
          <span className="text-sm text-muted-foreground">
            {t('logos.title')} 
          </span>
        </div>
        <div className="flex flex-wrap justify-between items-center gap-4">
          {logoKeys.map((key, i) => (
            <MotionDiv
              key={i}
              className="text-muted-foreground/70 font-medium"
            >
              {t(`logos.${key}`)}
            </MotionDiv>
          ))}
        </div>
      </div>
  );
}; 