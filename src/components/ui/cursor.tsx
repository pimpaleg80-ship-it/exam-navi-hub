import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

export function Cursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out the movement using spring physics
  const springX = useSpring(mouseX, { damping: 25, stiffness: 300, mass: 0.5 });
  const springY = useSpring(mouseY, { damping: 25, stiffness: 300, mass: 0.5 });

  useEffect(() => {
    // Check if it's a touch device
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouch(true);
      return;
    }

    // Check for reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsTouch(true); // Treat as touch to disable
      return;
    }

    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement;

      // Determine cursor state based on what's hovered
      const isClickable =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") !== null ||
        target.closest("button") !== null ||
        target.hasAttribute("role") && target.getAttribute("role") === "button";

      setIsPointer(isClickable);

      // Look for data-hover attribute or specific card classes
      const isHoverable =
        target.hasAttribute("data-hover") ||
        target.closest("[data-hover]") !== null ||
        target.closest(".group") !== null; // generic hover group

      setIsHovering(isHoverable);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible, mouseX, mouseY]);

  if (isTouch) return null;

  return (
    <>
      {/* Inner dot - instant follow */}
      <motion.div
        className={cn(
          "pointer-events-none fixed left-0 top-0 z-[9999] size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary mix-blend-difference transition-opacity duration-300",
          !isVisible && "opacity-0",
        )}
        style={{
          x: mouseX,
          y: mouseY,
        }}
        animate={{
          scale: isPointer ? 0 : 1,
        }}
        transition={{ duration: 0.15 }}
      />

      {/* Outer ring - delayed follow with spring */}
      <motion.div
        className={cn(
          "pointer-events-none fixed left-0 top-0 z-[9998] size-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary/40 transition-opacity duration-300",
          !isVisible && "opacity-0",
        )}
        style={{
          x: springX,
          y: springY,
        }}
        animate={{
          scale: isPointer ? 1.5 : isHovering ? 1.2 : 1,
          borderColor: isPointer ? "var(--color-primary)" : "rgba(var(--color-primary-rgb), 0.4)",
          backgroundColor: isPointer ? "rgba(var(--color-primary-rgb), 0.1)" : "transparent",
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />
    </>
  );
}
