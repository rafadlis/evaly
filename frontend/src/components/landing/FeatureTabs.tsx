"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  Brain,
  Presentation,
  Timer,
  BarChart,
  Award,
  Workflow,
  Users,
  Shield,
  Clock,
  Zap,
  Bot,
  Layers,
  Laptop,
  Camera,
} from "lucide-react";

const MotionDiv = motion.div;

// Feature data for each tab
const tabsData = {
  educators: [
    {
      icon: Brain,
      title: "AI Question Generator",
      description:
        "Create exam questions instantly with our AI engine by specifying topic, difficulty, and question type.",
      tags: ["Time-saving", "Customizable"],
    },
    {
      icon: Presentation,
      title: "Flexible Exam Formats",
      description:
        "Choose between Normal (list view) or Slide (presentation view) formats with rich media support.",
      tags: ["Rich Media", "Math Formulas"],
    },
    {
      icon: Timer,
      title: "Flexible Scheduling",
      description:
        "Set up Live Tests with synchronized timing or Self-Paced Tests with flexible time limits.",
      tags: ["Time Extensions", "Retake Policies"],
    },
    {
      icon: BarChart,
      title: "AI-Powered Analytics",
      description:
        "Gain insights into student performance with AI-driven analysis of weak areas and potential cheating.",
      tags: ["Data Export", "Real-time Alerts"],
    },
    {
      icon: Award,
      title: "Automatic Certification",
      description:
        "Generate and distribute certificates automatically upon successful exam completion.",
      tags: ["Customizable", "Verifiable"],
    },
    {
      icon: Workflow,
      title: "Collaboration Tools",
      description:
        "Work with team members to create exams and invite external examiners to monitor assessments.",
      tags: ["Team Access", "LMS Integration"],
    },
  ],
  companies: [
    {
      icon: Users,
      title: "Talent Assessment",
      description:
        "Evaluate candidates with standardized assessments to identify the best fit for your organization.",
      tags: ["Recruitment", "Skill Verification"],
    },
    {
      icon: Shield,
      title: "Compliance Training",
      description:
        "Ensure regulatory compliance with automated assessment and certification tracking.",
      tags: ["Audit-Ready", "Certification"],
    },
    {
      icon: Clock,
      title: "Time-Efficient Evaluation",
      description:
        "Reduce assessment time by 60% with automated grading and instant result generation.",
      tags: ["Automation", "Efficiency"],
    },
    {
      icon: Zap,
      title: "Performance Insights",
      description:
        "Identify skill gaps and create targeted training programs based on assessment results.",
      tags: ["Data-Driven", "Development"],
    },
    {
      icon: Bot,
      title: "AI-Powered Recommendations",
      description:
        "Receive intelligent suggestions for employee development based on assessment outcomes.",
      tags: ["Personalized", "Growth-Oriented"],
    },
    {
      icon: Workflow,
      title: "Seamless Integration",
      description:
        "Connect with your existing HR systems for streamlined data flow and unified reporting.",
      tags: ["API Access", "Data Sync"],
    },
  ],
  participants: [
    {
      icon: Laptop,
      title: "User-Friendly Interface",
      description:
        "Navigate through exams with an intuitive interface designed for optimal test-taking experience.",
      tags: ["Accessible", "Responsive"],
    },
    {
      icon: Timer,
      title: "Flexible Test Taking",
      description:
        "Take exams at your convenience with self-paced options or scheduled live sessions.",
      tags: ["Convenience", "Flexibility"],
    },
    {
      icon: BarChart,
      title: "Instant Feedback",
      description:
        "Receive immediate results and detailed feedback to understand your performance.",
      tags: ["Learning", "Improvement"],
    },
    {
      icon: Award,
      title: "Digital Certificates",
      description:
        "Earn verifiable digital certificates upon successful completion of assessments.",
      tags: ["Recognition", "Shareable"],
    },
    {
      icon: Shield,
      title: "Secure Environment",
      description:
        "Take exams in a secure, monitored environment that ensures fair assessment for all.",
      tags: ["Fair", "Reliable"],
    },
    {
      icon: Layers,
      title: "Progress Tracking",
      description:
        "Monitor your improvement over time with comprehensive progress tracking.",
      tags: ["Growth", "Analytics"],
    },
  ],
};

export const FeatureTabs = () => {
  const [activeTab, setActiveTab] = useState<
    "educators" | "companies" | "participants"
  >("educators");

  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.015] pointer-events-none"></div>
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">
            Comprehensive Examination Features
          </h2>
          <p className="text-muted-foreground max-w-[600px] mx-auto">
            Our platform combines question creation, test delivery, monitoring,
            and analysis in a single solution for schools and companies
          </p>
        </div>

        {/* Feature Tabs */}
        <div className="mb-12">
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-background border border-border/40 rounded-full p-1">
              <button
                onClick={() => setActiveTab("educators")}
                className={`px-6 py-2 rounded-full font-medium text-sm transition-all ${
                  activeTab === "educators"
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                For Educators
              </button>
              <button
                onClick={() => setActiveTab("companies")}
                className={`px-6 py-2 rounded-full font-medium text-sm transition-all ${
                  activeTab === "companies"
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                For Companies
              </button>
              <button
                onClick={() => setActiveTab("participants")}
                className={`px-6 py-2 rounded-full font-medium text-sm transition-all ${
                  activeTab === "participants"
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                For Participants
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tabsData[activeTab].map((feature, i) => (
              <MotionDiv
                key={`${activeTab}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                exit={{ opacity: 0, y: -20 }}
                layout
                className="group"
              >
                <div className="bg-background h-full p-6 border">
                  <feature.icon className="size-12 mb-6 " />
                  <h3 className="font-medium text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {feature.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {feature.tags.map((tag, j) => (
                      <div
                        key={j}
                        className="text-xs bg-primary/5 text-primary px-2 py-1 rounded-full"
                      >
                        {tag}
                      </div>
                    ))}
                  </div>
                </div>
              </MotionDiv>
            ))}
          </div>
        </div>

        {/* Security Features Highlight */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="bg-background border border-border/40 rounded-xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium text-lg">
                  Comprehensive Proctoring System
                </h3>
              </div>

              <p className="text-muted-foreground mb-6 max-w-[700px]">
                Evaly provides multi-layered security features to ensure exam
                integrity and prevent cheating for high-stakes examinations
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    icon: <Camera className="h-4 w-4" />,
                    text: "Webcam Surveillance",
                  },
                  {
                    icon: <Laptop className="h-4 w-4" />,
                    text: "Tab/Window Detection",
                  },
                  {
                    icon: <Bot className="h-4 w-4" />,
                    text: "Voice Detection",
                  },
                  {
                    icon: <Layers className="h-4 w-4" />,
                    text: "Activity Logging",
                  },
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                      {feature.icon}
                    </div>
                    <span className="text-sm font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </MotionDiv>
      </div>
    </section>
  );
};
