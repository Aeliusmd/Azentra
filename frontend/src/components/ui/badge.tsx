const TONES = {
  green: "bg-green-50 text-green-700 ring-green-200",
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
  red: "bg-rose-50 text-rose-700 ring-rose-200",
  purple: "bg-purple-50 text-purple-700 ring-purple-200",
  slate: "bg-gray-100 text-gray-600 ring-gray-200",
} as const;

export type BadgeTone = keyof typeof TONES;

export function Badge({
  tone = "slate",
  children,
}: {
  tone?: BadgeTone;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}
