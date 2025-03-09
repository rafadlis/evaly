"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

const MotionDiv = motion.div;

export const CTASection = () => {
  return (
    <section className="py-12 bg-foreground/[0.02] relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.015] pointer-events-none"></div>
      <div className="container text-center">
        <MotionDiv 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="bg-background p-8 rounded-2xl shadow-sm border border-border/40">
            <h2 className="text-2xl font-bold mb-3">Ready to transform your examination process?</h2>
            <p className="text-muted-foreground mb-6 max-w-[600px] mx-auto">
              Join schools, universities, and businesses that have made online exams easier, safer, and smarter with Evaly&apos;s comprehensive platform.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/auth/register">
                <Button variant="default" size="lg" className="rounded-full shadow-md hover:shadow-lg transition-all">
                  Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#">
                <Button variant="outline" size="lg" className="rounded-full">
                  Schedule Demo
                </Button>
              </Link>
            </div>
          </div>
        </MotionDiv>
      </div>
    </section>
  );
}; 