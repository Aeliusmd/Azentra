/** Status / priority pill used across the Property Manager lists. */

const TONES = {
  green: "bg-green-50 text-green-700",
  navy: "bg-[#eaf1f8] text-[#1b3a5c]",
  amber: "bg-amber-50 text-amber-700",
  orange: "bg-orange-50 text-orange-600",
  red: "bg-rose-50 text-rose-600",
  purple: "bg-purple-50 text-purple-700",
  slate: "bg-gray-100 text-gray-600",
} as const;

export type PillTone = keyof typeof TONES;

export function Pill({
  tone = "slate",
  children,
}: {
  tone?: PillTone;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}
