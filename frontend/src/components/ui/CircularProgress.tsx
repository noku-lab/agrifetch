interface CircularProgressProps {
  /** 0–100 */
  value: number;
  label: string;
  caption?: string;
  size?: number;
}

/** Custom vector circular progress ring used in the Core Ecosystem bento. */
export function CircularProgress({
  value,
  label,
  caption,
  size = 120,
}: CircularProgressProps) {
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-sm">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
          role="img"
          aria-label={`${label}: ${clamped}%`}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(139,146,143,0.2)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#b8f600"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <span className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
            {clamped}%
          </span>
        </div>
      </div>
      <div className="text-center">
        <p className="font-label-md text-label-md text-on-surface">{label}</p>
        {caption ? (
          <p className="font-label-sm text-label-sm text-on-surface-variant">{caption}</p>
        ) : null}
      </div>
    </div>
  );
}
