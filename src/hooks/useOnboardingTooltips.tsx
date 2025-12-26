import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "bridge-onboarding-tooltips-dismissed";

export interface TooltipStep {
  id: string;
  title: string;
  description: string;
}

const defaultSteps: TooltipStep[] = [
  { 
    id: "dashboard-welcome",
    title: "Your Command Center",
    description: "This dashboard gives you quick access to all your tools, CRM, tasks, and more."
  },
  { 
    id: "crm-intro",
    title: "Manage Your Pipeline",
    description: "The CRM helps you track contacts, deals, and activities all in one place."
  },
  { 
    id: "templates-intro",
    title: "Document Templates",
    description: "Find contracts, agreements, and marketing materials organized by division."
  },
  { 
    id: "ai-intro",
    title: "AI Assistant",
    description: "Generate emails, property descriptions, and deal summaries with Bridge AI."
  },
  { 
    id: "calculators-intro",
    title: "Real Estate Calculators",
    description: "Quickly calculate commissions, rent analysis, and investment metrics."
  },
];

export const useOnboardingTooltips = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [dismissedSteps, setDismissedSteps] = useState<string[]>([]);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    const dismissedList: string[] = dismissed ? JSON.parse(dismissed) : [];
    setDismissedSteps(dismissedList);
    
    // If not all steps are dismissed and not "all", start the tour
    const allDismissed = dismissedList.includes("all") || 
      defaultSteps.every(step => dismissedList.includes(step.id));
    
    if (!allDismissed) {
      // Find first non-dismissed step
      const firstActive = defaultSteps.findIndex(
        step => !dismissedList.includes(step.id)
      );
      if (firstActive >= 0) {
        setCurrentStep(firstActive);
        setIsActive(true);
      }
    }
  }, []);

  const dismissStep = useCallback((stepId: string) => {
    const newDismissed = [...dismissedSteps, stepId];
    setDismissedSteps(newDismissed);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newDismissed));
    
    // Move to next step
    const nextStep = currentStep + 1;
    if (nextStep < defaultSteps.length) {
      setCurrentStep(nextStep);
    } else {
      setIsActive(false);
    }
  }, [dismissedSteps, currentStep]);

  const dismissAll = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(["all"]));
    setDismissedSteps(["all"]);
    setIsActive(false);
  }, []);

  const resetTooltips = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setDismissedSteps([]);
    setCurrentStep(0);
    setIsActive(true);
  }, []);

  const isStepActive = useCallback((stepId: string) => {
    if (!isActive) return false;
    if (dismissedSteps.includes("all")) return false;
    if (dismissedSteps.includes(stepId)) return false;
    
    const stepIndex = defaultSteps.findIndex(s => s.id === stepId);
    return stepIndex === currentStep;
  }, [isActive, dismissedSteps, currentStep]);

  const getStep = useCallback((stepId: string): TooltipStep | undefined => {
    return defaultSteps.find(s => s.id === stepId);
  }, []);

  return {
    steps: defaultSteps,
    currentStep,
    totalSteps: defaultSteps.length,
    isActive,
    dismissStep,
    dismissAll,
    resetTooltips,
    isStepActive,
    getStep,
  };
};
