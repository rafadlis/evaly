"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { Wand2 } from "lucide-react";
import { motion } from "motion/react";
import { Badge } from "../ui/badge";

const MotionDiv = motion.div;

export const Hero = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute right-0 top-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-[120px]"></div>
        <div className="absolute left-0 bottom-1/4 w-96 h-96 bg-foreground/5 rounded-full filter blur-[120px]"></div>
      </div>

      <div className="container">
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
              AI-Powered <Wand2 />
            </Badge>
            <div className="h-1 w-1 rounded-full bg-border"></div>
            <div className="text-xs text-muted-foreground">
              Making Online Exams Easier, Safer, and Smarter
            </div>
          </Button>

          <h1 className="text-balance text-4xl md:text-5xl lg:text-6xl font-medium mb-4">
            Comprehensive Online Examination Platform
          </h1>

          <p className="text-xl mb-8 max-w-2xl text-primary/80">
            Empowering institutions and businesses with a secure, AI-driven examination platform for automated question creation, proctoring, and analytics.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/auth/register">
              <Button size="lg">
                Start Free Trial
              </Button>
            </Link>
            <Link href="#">
              <Button variant="outline" size="lg">
                Watch Demo
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
              <span className="font-medium text-foreground">1000+</span> schools
              and companies trust Evaly
            </p>
          </div>
        </MotionDiv>
      </div>
    </section>
  );
};
