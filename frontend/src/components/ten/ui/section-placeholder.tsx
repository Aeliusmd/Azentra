import { House } from "lucide-react";

import { Card } from "@/components/ui/card";

/**
 * Stand-in for a tenant section that has not been built yet, so every rail
 * entry leads somewhere instead of 404-ing. Each is replaced by its real view
 * as the screens land — a route file at the matching path takes precedence over
 * the catch-all that renders this.
 */
export function TenSectionPlaceholder({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] leading-tight font-bold text-ink sm:text-[28px]">
          {title}
        </h1>
        <p className="mt-1 text-[14px] text-muted">{subtitle}</p>
      </div>

      <Card className="px-6 py-16 text-center">
        <span
          aria-hidden="true"
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#eef3f9] text-[#5b7f9c]"
        >
          <House className="h-5 w-5" />
        </span>
        <p className="mt-4 text-[17px] font-semibold text-ink">
          {title} is next up
        </p>
        <p className="mx-auto mt-1 max-w-[420px] text-[15px] text-muted">
          This section is not built yet. The dashboard already reads from the
          same records it will use.
        </p>
      </Card>
    </div>
  );
}
