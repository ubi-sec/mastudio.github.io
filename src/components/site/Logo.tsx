import { useId } from "react";
import { cn } from "@/lib/utils";

/** MA monogram: an M whose right peak doubles as the apex of an A. */
export function Monogram({ className, animated = false }: { className?: string; animated?: boolean }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 62 46" className={cn("h-9 w-auto", className)} aria-hidden="true" fill="none">
      <defs>
        <linearGradient id={`g-${id}`} x1="0" y1="0" x2="62" y2="46" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--gold-deep)" />
          <stop offset="0.45" stopColor="var(--gold-light)" />
          <stop offset="1" stopColor="var(--gold)" />
        </linearGradient>
      </defs>
      <g stroke={`url(#g-${id})`} strokeLinecap="square" strokeLinejoin="miter">
        {/* M */}
        <path
          className={animated ? "stroke-draw" : undefined}
          d="M4 42 L14 4 L28 31 L42 4"
          strokeWidth="2.6"
        />
        {/* A — shares the right peak */}
        <path className={animated ? "stroke-draw" : undefined} d="M42 4 L56 42" strokeWidth="2.6" />
        <path className={animated ? "stroke-draw" : undefined} d="M31.5 27 L50.5 27" strokeWidth="1.4" />
        {/* hairline serifs */}
        <path d="M0 42.5 H9 M51 42.5 H61" strokeWidth="1" />
      </g>
    </svg>
  );
}

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <Monogram />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-serif text-xl font-medium tracking-wide text-foreground">MA Studio</span>
          <span className="mt-1 text-[0.55rem] uppercase tracking-[0.42em] text-gold-ink">Photography</span>
        </span>
      )}
    </span>
  );
}
