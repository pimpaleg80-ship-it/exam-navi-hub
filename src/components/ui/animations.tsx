import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";

export function StaggerContainer({
  children,
  className,
  delay = 0,
  staggerChildren = 0.05,
  ...props
}: HTMLMotionProps<"div"> & { delay?: number; staggerChildren?: number }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren,
            delayChildren: delay,
          },
        },
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function SlideUp({
  children,
  className,
  delay,
  duration = 0.4,
  y = 20,
  asChild = false,
  ...props
}: HTMLMotionProps<"div"> & {
  delay?: number;
  duration?: number;
  y?: number;
  asChild?: boolean;
}) {
  const Comp = asChild ? motion.span : motion.div;
  return (
    <Comp
      variants={{
        hidden: { opacity: 0, y },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration, delay, ease: [0.22, 1, 0.36, 1] }
        }
      }}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: -y }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function FadeIn({
  children,
  className,
  delay,
  duration = 0.4,
  ...props
}: HTMLMotionProps<"div"> & { delay?: number; duration?: number }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { duration, delay, ease: "easeInOut" }
        }
      }}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0 }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function PageTransition({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
