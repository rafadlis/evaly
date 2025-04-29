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
import { useTranslations } from 'next-intl';

const MotionDiv = motion.div;

// Feature data for each tab
const getTabsData = (t: ReturnType<typeof useTranslations>) => ({
  educators: [
    {
      icon: Brain,
      title: t('educators.aiQuestionGenerator.title'),
      description: t('educators.aiQuestionGenerator.description'),
      tags: t.raw('educators.aiQuestionGenerator.tags') as string[],
    },
    {
      icon: Presentation,
      title: t('educators.flexibleExamFormats.title'),
      description: t('educators.flexibleExamFormats.description'),
      tags: t.raw('educators.flexibleExamFormats.tags') as string[],
    },
    {
      icon: Timer,
      title: t('educators.flexibleScheduling.title'),
      description: t('educators.flexibleScheduling.description'),
      tags: t.raw('educators.flexibleScheduling.tags') as string[],
    },
    {
      icon: BarChart,
      title: t('educators.aiPoweredAnalytics.title'),
      description: t('educators.aiPoweredAnalytics.description'),
      tags: t.raw('educators.aiPoweredAnalytics.tags') as string[],
    },
    {
      icon: Award,
      title: t('educators.automaticCertification.title'),
      description: t('educators.automaticCertification.description'),
      tags: t.raw('educators.automaticCertification.tags') as string[],
    },
    {
      icon: Workflow,
      title: t('educators.collaborationTools.title'),
      description: t('educators.collaborationTools.description'),
      tags: t.raw('educators.collaborationTools.tags') as string[],
    },
  ],
  companies: [
    {
      icon: Users,
      title: t('companies.talentAssessment.title'),
      description: t('companies.talentAssessment.description'),
      tags: t.raw('companies.talentAssessment.tags') as string[],
    },
    {
      icon: Shield,
      title: t('companies.complianceTraining.title'),
      description: t('companies.complianceTraining.description'),
      tags: t.raw('companies.complianceTraining.tags') as string[],
    },
    {
      icon: Clock,
      title: t('companies.timeEfficientEvaluation.title'),
      description: t('companies.timeEfficientEvaluation.description'),
      tags: t.raw('companies.timeEfficientEvaluation.tags') as string[],
    },
    {
      icon: Zap,
      title: t('companies.performanceInsights.title'),
      description: t('companies.performanceInsights.description'),
      tags: t.raw('companies.performanceInsights.tags') as string[],
    },
    {
      icon: Bot,
      title: t('companies.aiPoweredRecommendations.title'),
      description: t('companies.aiPoweredRecommendations.description'),
      tags: t.raw('companies.aiPoweredRecommendations.tags') as string[],
    },
    {
      icon: Workflow,
      title: t('companies.seamlessIntegration.title'),
      description: t('companies.seamlessIntegration.description'),
      tags: t.raw('companies.seamlessIntegration.tags') as string[],
    },
  ],
  participants: [
    {
      icon: Laptop,
      title: t('participants.userFriendlyInterface.title'),
      description: t('participants.userFriendlyInterface.description'),
      tags: t.raw('participants.userFriendlyInterface.tags') as string[],
    },
    {
      icon: Timer,
      title: t('participants.flexibleTestTaking.title'),
      description: t('participants.flexibleTestTaking.description'),
      tags: t.raw('participants.flexibleTestTaking.tags') as string[],
    },
    {
      icon: BarChart,
      title: t('participants.instantFeedback.title'),
      description: t('participants.instantFeedback.description'),
      tags: t.raw('participants.instantFeedback.tags') as string[],
    },
    {
      icon: Award,
      title: t('participants.digitalCertificates.title'),
      description: t('participants.digitalCertificates.description'),
      tags: t.raw('participants.digitalCertificates.tags') as string[],
    },
    {
      icon: Shield,
      title: t('participants.secureEnvironment.title'),
      description: t('participants.secureEnvironment.description'),
      tags: t.raw('participants.secureEnvironment.tags') as string[],
    },
    {
      icon: Layers,
      title: t('participants.progressTracking.title'),
      description: t('participants.progressTracking.description'),
      tags: t.raw('participants.progressTracking.tags') as string[],
    },
  ],
});

export const FeatureTabs = () => {
  const t = useTranslations('HomePage.features');
  const [activeTab, setActiveTab] = useState<
    "educators" | "companies" | "participants"
  >("educators");

  const tabsData = getTabsData(t);

  return (
    <section className="pb-20 relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.015] pointer-events-none"></div>
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">
            {t('title')}
          </h2>
          <p className="text-muted-foreground max-w-[600px] mx-auto">
            {t('description')}
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
                {t('educatorsTab')}
              </button>
              <button
                onClick={() => setActiveTab("companies")}
                className={`px-6 py-2 rounded-full font-medium text-sm transition-all ${
                  activeTab === "companies"
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {t('companiesTab')}
              </button>
              <button
                onClick={() => setActiveTab("participants")}
                className={`px-6 py-2 rounded-full font-medium text-sm transition-all ${
                  activeTab === "participants"
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {t('participantsTab')}
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
                    {feature.tags.map((tag: string, j: number) => (
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
                  {t('security.title')}
                </h3>
              </div>

              <p className="text-muted-foreground mb-6 max-w-[700px]">
                {t('security.description')}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    icon: <Camera className="h-4 w-4" />,
                    text: t('security.webcamSurveillance'),
                  },
                  {
                    icon: <Laptop className="h-4 w-4" />,
                    text: t('security.tabWindowDetection'),
                  },
                  {
                    icon: <Bot className="h-4 w-4" />,
                    text: t('security.voiceDetection'),
                  },
                  {
                    icon: <Layers className="h-4 w-4" />,
                    text: t('security.activityLogging'),
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
