'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface FormCardProps {
  children: ReactNode;
  stepKey: string;
  direction: number;
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 200 : -200,
    opacity: 0,
  }),
};

export default function FormCard({ children, stepKey, direction }: FormCardProps) {
  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={stepKey}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          x: { type: 'spring', stiffness: 300, damping: 30 },
          opacity: { duration: 0.2 },
        }}
        className="w-full max-w-2xl mx-auto"
      >
        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-5 md:p-8 lg:p-12">
          {children}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
