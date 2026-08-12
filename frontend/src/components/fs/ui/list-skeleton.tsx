import { Card } from "@/components/ui/card";

/**
 * Placeholder for a filter bar plus table while the view waits on the URL's
 * search params. Same rhythm as the real list, so nothing jumps on swap.
 */
export function FsListSkeleton({
  title,
  subtitle,
  rows = 6,
}: {
  title: string;
  subtitle: string;
  rows?: number;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[32px] leading-tight font-bold text-ink">
          {title}
        </h1>
        <p className="mt-1 text-[15px] text-muted">{subtitle}</p>
      </div>

      <Card className="p-5">
        <div className="h-10 animate-pulse rounded-md bg-gray-100" />
        <div className="mt-4 flex flex-wrap gap-2">
          {Array.from({ length: 8 }, (_, index) => (
            <div
              key={index}
              className="h-8 w-24 animate-pulse rounded-lg bg-gray-100"
            />
          ))}
        </div>
      </Card>

      <Card className="divide-y divide-hairline">
        {Array.from({ length: rows }, (_, index) => (
          <div key={index} className="flex items-center gap-4 px-5 py-4">
            <div className="h-4 w-20 animate-pulse rounded bg-gray-100" />
            <div className="h-4 flex-1 animate-pulse rounded bg-gray-100" />
            <div className="h-5 w-16 animate-pulse rounded-full bg-gray-100" />
            <div className="h-5 w-20 animate-pulse rounded-full bg-gray-100" />
          </div>
        ))}
      </Card>
    </div>
  );
}
