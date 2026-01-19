// src/components/onboarding/ProductTour.tsx

import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';

interface TourStep {
  target: string; // CSS selector
  title: string;
  description: string;
  placement: 'top' | 'bottom' | 'left' | 'right';
}

const TOUR_STEPS: TourStep[] = [
  {
    target: '[data-tour="stats"]',
    title: 'Your Key Metrics',
    description:
      'See your most important healthcare metrics at a glance—patients, encounters, readmissions, and costs.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="ask-vizier"]',
    title: 'Ask Vizier',
    description:
      'Click here anytime to ask questions about your data in plain English. No SQL or technical knowledge needed.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="saved-insights"]',
    title: 'Saved Insights',
    description:
      'Your saved analyses appear here. Build a library of insights your team can reference anytime.',
    placement: 'top',
  },
  {
    target: '[data-tour="sidebar-nav"]',
    title: 'Navigate Your Data',
    description:
      'Switch between your dashboard, ask new questions, or upload additional data files.',
    placement: 'right',
  },
];

interface ProductTourProps {
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export const ProductTour: React.FC<ProductTourProps> = ({
  isActive,
  onComplete,
  onSkip,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetPosition, setTargetPosition] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const step = TOUR_STEPS[currentStep];
    const element = document.querySelector(step.target);

    if (element) {
      const rect = element.getBoundingClientRect();
      setTargetPosition(rect);

      // Scroll element into view
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentStep, isActive]);

  if (!isActive || !targetPosition) return null;

  const step = TOUR_STEPS[currentStep];
  const isLastStep = currentStep === TOUR_STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      localStorage.setItem('onboarding_tour_completed', 'true');
      onComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('onboarding_tour_completed', 'true');
    onSkip();
  };

  // Calculate tooltip position based on placement
  const getTooltipStyle = () => {
    const offset = 16;
    let top = 0;
    let left = 0;

    switch (step.placement) {
      case 'bottom':
        top = targetPosition.bottom + offset;
        left = targetPosition.left + targetPosition.width / 2;
        break;
      case 'top':
        top = targetPosition.top - offset;
        left = targetPosition.left + targetPosition.width / 2;
        break;
      case 'right':
        top = targetPosition.top + targetPosition.height / 2;
        left = targetPosition.right + offset;
        break;
      case 'left':
        top = targetPosition.top + targetPosition.height / 2;
        left = targetPosition.left - offset;
        break;
    }

    return { top: `${top}px`, left: `${left}px` };
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />

      {/* Highlight */}
      <div
        className="fixed z-50 pointer-events-none"
        style={{
          top: `${targetPosition.top - 4}px`,
          left: `${targetPosition.left - 4}px`,
          width: `${targetPosition.width + 8}px`,
          height: `${targetPosition.height + 8}px`,
          boxShadow:
            '0 0 0 4px rgba(255, 255, 255, 0.5), 0 0 0 9999px rgba(0, 0, 0, 0.6)',
          borderRadius: '12px',
        }}
      />

      {/* Tooltip */}
      <div
        className="fixed z-50 animate-slide-up"
        style={{
          ...getTooltipStyle(),
          transform:
            step.placement === 'top' || step.placement === 'bottom'
              ? 'translateX(-50%)'
              : step.placement === 'left'
                ? 'translateX(-100%)'
                : 'none',
        }}
      >
        <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm border-2 border-gray-200">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {currentStep + 1} of {TOUR_STEPS.length}
              </span>
            </div>
            <button
              onClick={handleSkip}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
          <p className="text-gray-600 mb-6">{step.description}</p>

          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-1 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-1 px-6 py-2 bg-black hover:bg-gray-800 text-white font-semibold rounded-lg transition-colors"
            >
              {isLastStep ? 'Finish' : 'Next'}
              {!isLastStep && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
