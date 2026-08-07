import Link from "next/link";
import { Plus, type LucideIcon } from "lucide-react";

const CLASSES =
  "flex items-center gap-2 rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white " +
  "transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 " +
  "focus-visible:ring-offset-2 focus-visible:outline-none";

/** Navigates when given `href`, otherwise acts as a button. */
export function AddButton({
  href,
  onClick,
  label,
  icon: Icon = Plus,
}: {
  href?: string;
  onClick?: () => void;
  label: string;
  icon?: LucideIcon;
}) {
  const content = (
    <>
      <Icon aria-hidden="true" className="h-4 w-4" />
      {label}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={CLASSES}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={CLASSES}>
      {content}
    </button>
  );
}
