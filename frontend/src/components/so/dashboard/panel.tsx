import Link from "next/link";

import { Card } from "@/components/ui/card";

/**
 * A dashboard panel: a titled card, optionally with a link through to the
 * screen that holds the whole of what it is previewing.
 */
export function Panel({
  title,
  href,
  linkLabel = "View All",
  children,
}: {
  title: string;
  href?: string;
  linkLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="flex flex-col">
      <div className="flex items-center justify-between gap-4 px-5 pt-5 pb-4">
        <h2 className="text-[15px] font-bold text-ink">{title}</h2>
        {href && (
          <Link
            href={href}
            className="shrink-0 text-[13px] font-medium text-link transition-colors hover:text-link-dark"
          >
            {linkLabel}
          </Link>
        )}
      </div>
      {children}
    </Card>
  );
}
