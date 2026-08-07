import Link from "next/link";
import type { LucideIcon } from "lucide-react";

const BASE =
  "inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors " +
  "hover:bg-gray-100 hover:text-ink focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none";

/** Icon-only control with a required accessible name. */
export function IconButton({
  icon: Icon,
  label,
  href,
  onClick,
  tone = "default",
}: {
  icon: LucideIcon;
  label: string;
  href?: string;
  onClick?: () => void;
  tone?: "default" | "danger";
}) {
  const className =
    tone === "danger"
      ? `${BASE} hover:bg-rose-50 hover:text-rose-600`
      : BASE;

  const content = (
    <>
      <Icon aria-hidden="true" className="h-4 w-4" />
      <span className="sr-only">{label}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}
