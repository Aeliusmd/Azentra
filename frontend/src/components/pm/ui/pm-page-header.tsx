import { Plus } from "lucide-react";

/** Green pill action used at the top-right of every Property Manager list. */
export function PmPrimaryButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg bg-brand px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <Plus aria-hidden="true" className="h-[18px] w-[18px]" />
      {label}
    </button>
  );
}

export function PmPageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-[32px] leading-tight font-bold text-ink">{title}</h1>
        <p className="mt-1 text-[15px] text-muted">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}
