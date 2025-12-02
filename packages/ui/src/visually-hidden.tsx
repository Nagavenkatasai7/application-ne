"use client";

import * as React from "react";
import { cn } from "./utils";

interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  as?: React.ElementType;
}

export function VisuallyHidden({
  children,
  as: Component = "span",
  className,
  ...props
}: VisuallyHiddenProps) {
  return (
    <Component className={cn("sr-only", className)} {...props}>
      {children}
    </Component>
  );
}

export function ScreenReaderOnly({
  children,
  as: Component = "span",
  className,
  ...props
}: {
  children: React.ReactNode;
  as?: React.ElementType;
  className?: string;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <Component className={cn("sr-only", className)} {...props}>
      {children}
    </Component>
  );
}
