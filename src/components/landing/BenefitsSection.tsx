"use client";

import { motion } from "motion/react";
import { CheckCircle } from "lucide-react";
import { useTranslations } from 'next-intl';

const MotionDiv = motion.div;

export const BenefitsSection = () => {
  const t = useTranslations('HomePage.benefits');
  
  const benefits = [
    {
      title: t('allInOne'),
      description: t('allInOneDesc')
    },
    {
      title: t('aiIntegration'),
      description: t('aiIntegrationDesc')
    },
    {
      title: t('dualMode'),
      description: t('dualModeDesc')
    },
    {
      title: t('security'),
      description: t('securityDesc')
    }
  ];

  return (
    <section className="py-20">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">{t('title')}</h2>
          <div className="text-sm px-3 py-1 bg-foreground/10 text-foreground">
            {t('competitiveEdge')}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {benefits.map((benefit, i) => (
            <MotionDiv 
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -10 : 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: Math.floor(i / 2) * 0.1 }}
              viewport={{ once: true }}
              className="flex gap-4 p-4 hover:bg-foreground/[0.02] transition-colors duration-300 border border-border/40"
            >
              <div className="bg-foreground/10 h-10 w-10 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <h3 className="font-medium text-sm mb-1">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            </MotionDiv>
          ))}
        </div>
      </div>
    </section>
  );
}; 