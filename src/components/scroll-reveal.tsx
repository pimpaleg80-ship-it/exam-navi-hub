import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@/lib/utils";

type ScrollRevealProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export function ScrollReveal<T extends ElementType = "div">({
  as,
  children,
  className,
  ...props
}: ScrollRevealProps<T>) {
  const Component = as ?? "div";
  const ref = useScrollReveal<HTMLElement>();

  return (
    <Component ref={ref} className={cn("reveal-on-scroll", className)} {...props}>
      {children}
    </Component>
  );
}