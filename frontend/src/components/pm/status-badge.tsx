/** Shared tone vocabulary for the Property Manager screens. */
export type StatusTone = "green" | "amber" | "red" | "blue" | "purple" | "slate";

/** Small coloured dot — schedule rows, notification rows. */
export const TONE_DOT: Record<StatusTone, string> = {
  green: "bg-[#22a35c]",
  amber: "bg-[#e8a33d]",
  red: "bg-rose-500",
  blue: "bg-[#4a7fb5]",
  purple: "bg-purple-500",
  slate: "bg-gray-300",
};
