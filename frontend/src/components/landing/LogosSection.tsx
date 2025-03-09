"use client"
import { motion } from "motion/react";

const MotionDiv = motion.div;

export const LogosSection = () => {
  const logos = [
    'Top Universities', 
    'K-12 Schools', 
    'Training Centers', 
    'HR Departments', 
    'Certification Providers'
  ];
  
  return (
    <section className="py-8 border-y border-border/40">
      <div className="container">
        <div className="text-center text-sm text-muted-foreground mb-6">
          Trusted by educational institutions and businesses
        </div>
        <div className="flex flex-wrap justify-between items-center gap-4">
          {logos.map((logo, i) => (
            <MotionDiv
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-muted-foreground/70 font-medium"
            >
              {logo}
            </MotionDiv>
          ))}
        </div>
      </div>
    </section>
  );
}; 