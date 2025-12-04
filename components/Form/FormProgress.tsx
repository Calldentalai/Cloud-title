'use client';

import { motion } from 'framer-motion';

interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
}

export default function FormProgress({ currentStep, totalSteps }: FormProgressProps) {
  const progress = ((currentStep) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500">
          Step {currentStep + 1} of {totalSteps}
        </span>
        <span className="text-sm text-gray-500">{Math.round(progress)}% complete</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-blue-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
