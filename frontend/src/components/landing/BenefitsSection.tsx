"use client";

import { motion } from "motion/react";
import { CheckCircle } from "lucide-react";

const MotionDiv = motion.div;

const benefits = [
  {
    title: "All-in-One Solution",
    description: "Combines question creation, test delivery, monitoring, and analysis in a single platform."
  },
  {
    title: "AI Integration",
    description: "Automated question generation and result analysis sets Evaly apart from basic testing platforms."
  },
  {
    title: "Dual-Mode Testing",
    description: "Flexibility between Live and Self-Paced exams for different use cases."
  },
  {
    title: "Comprehensive Security",
    description: "Multi-layered proctoring system for high-stakes examinations."
  }
];

export const BenefitsSection = () => {
  return (
    <section className="py-20">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Why Choose Evaly</h2>
          <div className="text-sm px-3 py-1 rounded-full bg-foreground/10 text-foreground">
            Competitive Edge
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
              className="flex gap-4 p-4 rounded-xl hover:bg-foreground/[0.02] transition-colors duration-300 border border-border/40"
            >
              <div className="bg-foreground/10 h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0">
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