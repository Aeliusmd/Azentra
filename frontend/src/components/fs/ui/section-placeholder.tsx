import { Hammer } from "lucide-react";

import { Card } from "@/components/ui/card";

/**
 * Stand-in for a supervisor section that has not been designed yet, so every
 * rail entry leads somewhere instead of 404-ing. Each one is replaced by its
 * real view as the screens land.
 */
export function FsSectionPlaceholder({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[32px] leading-tight font-bold text-ink">
          {title}
        </h1>
        <p className="mt-1 text-[15px] text-muted">{subtitle}</p>
      </div>

      <Card className="px-6 py-16 text-center">
        <span
          aria-hidden="true"
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#eef3f9] text-[#5b7f9c]"
        >
          <Hammer className="h-5 w-5" />
        </span>
        <p className="mt-4 text-[17px] font-semibold text-ink">
          {title} is next up
        </p>
        <p className="mx-auto mt-1 max-w-[420px] text-[15px] text-muted">
          This section is not built yet. The dashboard already reads from the
          same work-order data it will use.
        </p>
      </Card>
    </div>
  );
}
