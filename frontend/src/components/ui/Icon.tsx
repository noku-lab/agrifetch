import type { CSSProperties } from "react";
import { cn } from "../../lib/cn";

interface IconProps {
  name: string;
  filled?: boolean;
  className?: string;
  style?: CSSProperties;
  /** Decorative by default; pass a label to expose it to assistive tech. */
  label?: string;
}

/** Material Symbols Outlined icon. */
export function Icon({ name, filled = false, className, style, label }: IconProps) {
  return (
    <span
      className={cn("material-symbols-outlined leading-none", className)}
      style={{ fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0", ...style }}
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
    >
      {name}
    </span>
  );
}
