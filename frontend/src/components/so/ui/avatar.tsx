/**
 * The disc against a visitor's name.
 *
 * Green where the person is on site, neutral otherwise — so a guard scanning a
 * column can see who is actually inside without reading the status pill.
 */
export function SoAvatar({
  name,
  tone = "slate",
  className = "h-8 w-8 text-[13px]",
}: {
  name: string;
  tone?: "slate" | "green";
  className?: string;
}) {
  const tint =
    tone === "green"
      ? "bg-green-50 text-green-700"
      : "bg-[#eef3f9] text-[#5b7f9c]";

  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${tint} ${className}`}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}
