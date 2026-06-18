import type { ElementType, ReactNode } from "react";
import { cn } from "../../lib/cn";

interface GlassPanelProps {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

/** Frosted emerald surface used for cards, HUD overlays, and panels. */
export function GlassPanel({ as: Tag = "div", className, children }: GlassPanelProps) {
  return <Tag className={cn("glass-panel rounded-xl", className)}>{children}</Tag>;
}
