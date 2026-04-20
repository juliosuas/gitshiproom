"use client";

export function Sparkline({
  values,
  height = 80,
}: {
  values: number[];
  height?: number;
}) {
  const max = Math.max(1, ...values);
  const w = 100;
  const h = height;
  const step = values.length > 1 ? w / (values.length - 1) : w;

  const points = values.map((v, i) => ({
    x: i * step,
    y: h - (v / max) * (h - 12) - 6,
  }));

  const area = [
    `M 0 ${h}`,
    ...points.map((p) => `L ${p.x} ${p.y}`),
    `L ${w} ${h}`,
    "Z",
  ].join(" ");

  const line = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className="h-[var(--spark-h)] w-full"
      style={{ "--spark-h": `${h}px` } as React.CSSProperties}
    >
      <defs>
        <linearGradient id="spark-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--coral)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--coral)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#spark-fill)" />
      <path
        d={line}
        fill="none"
        stroke="var(--coral)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {points.map((p, i) => {
        if (values[i] === 0) return null;
        return (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="1.6"
            fill="var(--coral)"
            vectorEffect="non-scaling-stroke"
          />
        );
      })}
    </svg>
  );
}
