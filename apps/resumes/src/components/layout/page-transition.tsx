"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

// Animation variants based on Design Document Section 3
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const reducedMotionVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const pageTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 25,
};

const reducedMotionTransition = {
  duration: 0.01,
};

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={prefersReducedMotion ? reducedMotionVariants : pageVariants}
      transition={prefersReducedMotion ? reducedMotionTransition : pageTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Stagger container for animating children
const staggerContainerVariants = {
  initial: {},
  animate: {
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.08,
    },
  },
};

const reducedStaggerContainerVariants = {
  initial: {},
  animate: {
    transition: {
      delayChildren: 0,
      staggerChildren: 0,
    },
  },
};

const staggerItemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 25,
    },
  },
};

const reducedStaggerItemVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.01 },
  },
};

export function StaggerContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={prefersReducedMotion ? reducedStaggerContainerVariants : staggerContainerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      variants={prefersReducedMotion ? reducedStaggerItemVariants : staggerItemVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Card hover animation
export function AnimatedCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  const hoverProps = prefersReducedMotion
    ? {}
    : {
        whileHover: {
          y: -8,
          scale: 1.02,
          transition: {
            type: "spring" as const,
            stiffness: 400,
            damping: 30,
          },
        },
      };

  return (
    <motion.div {...hoverProps} className={className}>
      {children}
    </motion.div>
  );
}

// Animated list with exit animations
const listItemVariants = {
  initial: { opacity: 0, x: -20, scale: 0.95 },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

const reducedListItemVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.01 } },
  exit: { opacity: 0, transition: { duration: 0.01 } },
};

export function AnimatedList({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <AnimatePresence mode="popLayout">
      <div className={className}>{children}</div>
    </AnimatePresence>
  );
}

export function AnimatedListItem({
  children,
  className,
  layoutId,
}: {
  children: React.ReactNode;
  className?: string;
  layoutId?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      layout
      layoutId={layoutId}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={prefersReducedMotion ? reducedListItemVariants : listItemVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
