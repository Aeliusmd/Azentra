import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function PageHeader({
  title,
  subtitle,
  backHref,
  backLabel,
  action,
}: {
  title: string;
  subtitle: string;
  backHref?: string;
  backLabel?: string;
  action?: React.ReactNode;
}) {
  return (
    <div>
      {backHref && (
        <Link
          href={backHref}
          className="mb-4 inline-flex items-center gap-2 text-[13px] text-gray-600 transition-colors hover:text-ink"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          {backLabel}
        </Link>
      )}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">{title}</h1>
          <p className="mt-1 text-[13px] text-muted">{subtitle}</p>
        </div>
        {action}
      </div>
    </div>
  );
}
