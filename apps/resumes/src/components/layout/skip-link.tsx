"use client";

interface SkipLinkProps {
  targetId: string;
  children: React.ReactNode;
}

/**
 * Skip link for keyboard navigation - WCAG 2.1 AA: 2.4.1
 */
export function SkipLink({ targetId, children }: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      {children}
    </a>
  );
}
