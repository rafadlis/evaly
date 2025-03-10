"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Wand2 } from "lucide-react";
import { motion } from "motion/react";
import { Badge } from "../ui/badge";

const MotionDiv = motion.div;

export const Hero = () => {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute right-0 top-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-[120px]"></div>
        <div className="absolute left-0 bottom-1/4 w-96 h-96 bg-foreground/5 rounded-full filter blur-[120px]"></div>
      </div>
      
      {/* Animated background grid */}
      <div className="absolute inset-0 -z-10 bg-grid-pattern opacity-[0.03]"></div>
      
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <MotionDiv 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <Button variant={"outline"} className="p-1 pr-3 rounded-full h-max mb-2">
              <Badge>
                AI-Powered <Wand2 />
              </Badge>
              <div className="h-1 w-1 rounded-full bg-border"></div>
              <div className="text-xs text-muted-foreground">Making Online Exams Easier, Safer, and Smarter</div>
            </Button>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Comprehensive Online Examination Platform
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Evaly serves educational institutions and businesses with a secure, flexible, and intelligent testing environment. Our platform leverages AI technology for question generation, integrity monitoring, and result analysis.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link href="/auth/register">
                <Button size="lg" className="rounded-full shadow-md hover:shadow-lg transition-all">
                  Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#">
                <Button variant="outline" size="lg" className="rounded-full">
                  Watch Demo <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="mt-12 flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-10 w-10 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-xs font-medium shadow-sm">
                    {i}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">1000+</span> schools and companies trust Evaly
              </p>
            </div>
          </MotionDiv>
          
          {/* Dashboard Preview */}
          <MotionDiv
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl blur-3xl opacity-30 -z-10"></div>
            
            <div className="aspect-[4/3] rounded-xl bg-background/80 backdrop-blur-md border border-border/40 shadow-xl overflow-hidden">
              <div className="p-4 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-xs font-medium px-2 py-1 rounded-md bg-primary/10 text-primary">Exam Creator Preview</div>
                </div>
                
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <MotionDiv 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="bg-background/80 backdrop-blur-sm rounded-md p-3 shadow-sm border border-border/40"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs font-medium">Active Exams</div>
                      <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center">
                        <ArrowUpRight className="h-2 w-2 text-primary" />
                      </div>
                    </div>
                    <div className="text-xl font-bold">24</div>
                    <div className="text-xs text-muted-foreground mt-1">+12% from last month</div>
                  </MotionDiv>
                  
                  <MotionDiv 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="bg-background/80 backdrop-blur-sm rounded-md p-3 shadow-sm border border-border/40"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs font-medium">Participants</div>
                      <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center">
                        <ArrowUpRight className="h-2 w-2 text-primary" />
                      </div>
                    </div>
                    <div className="text-xl font-bold">512</div>
                    <div className="text-xs text-muted-foreground mt-1">+8% from last month</div>
                  </MotionDiv>
                  
                  <MotionDiv 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="bg-background/80 backdrop-blur-sm rounded-md p-3 shadow-sm border border-border/40"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs font-medium">Completion Rate</div>
                      <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center">
                        <ArrowUpRight className="h-2 w-2 text-primary" />
                      </div>
                    </div>
                    <div className="text-xl font-bold">87%</div>
                    <div className="text-xs text-muted-foreground mt-1">+5% from last month</div>
                  </MotionDiv>
                  
                  <MotionDiv 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="bg-background/80 backdrop-blur-sm rounded-md p-3 shadow-sm border border-border/40"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs font-medium">AI Questions</div>
                      <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center">
                        <ArrowUpRight className="h-2 w-2 text-primary" />
                      </div>
                    </div>
                    <div className="text-xl font-bold">1,240</div>
                    <div className="text-xs text-muted-foreground mt-1">+32% from last month</div>
                  </MotionDiv>
                </div>
              </div>
            </div>
          </MotionDiv>
        </div>
      </div>
    </section>
  );
}; 