import Link from "next/link";
import { CircleArrowDown } from "lucide-react";

import { Card } from "@/components/ui/card";
import {
  shortDate,
  UPCOMING_STYLE,
  type AccRecentPayment,
  type AccUpcomingTask,
} from "@/lib/acc/dashboard-data";
import { lkr, lkrK } from "@/lib/acc/money";
import { ACC_BASE } from "@/lib/acc/nav";

/** Card heading with the link that opens the full list. */
function PanelHeader({
  title,
  linkLabel,
  href,
}: {
  title: string;
  linkLabel: string;
  href: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h2 className="text-[15px] font-bold text-ink">{title}</h2>
      <Link
        href={href}
        className="text-[13px] font-medium text-link transition-colors hover:text-link-dark"
      >
        {linkLabel}
        <span className="sr-only"> — {title}</span>
      </Link>
    </div>
  );
}

/** The last few payments to land, with how they were made. */
export function RecentPayments({
  payments,
}: {
  payments: AccRecentPayment[];
}) {
  return (
    <Card className="flex h-full flex-col p-5">
      <PanelHeader
        title="Recent Payments"
        linkLabel="View all"
        href={`${ACC_BASE}/payments`}
      />

      {payments.length === 0 ? (
        <p className="py-12 text-center text-[15px] text-muted">
          No payments recorded for this period.
        </p>
      ) : (
        <ul className="mt-4 space-y-6">
          {payments.map((payment) => (
            <li key={payment.id} className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-50 text-[#2f9e63]"
              >
                <CircleArrowDown className="h-[18px] w-[18px]" />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-semibold text-ink">
                  {payment.resident}
                </span>
                <span className="mt-0.5 block truncate text-[13px] text-muted">
                  {payment.unit} · {payment.method}
                </span>
              </span>

              <span className="shrink-0 text-right">
                <span className="block text-[15px] font-bold text-[#2f9e63]">
                  {lkr(payment.amount)}
                </span>
                <span className="mt-0.5 block text-[13px] text-muted">
                  {payment.date}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

/** What the accountant owes the calendar over the next couple of weeks. */
export function UpcomingTasks({ tasks }: { tasks: AccUpcomingTask[] }) {
  return (
    <Card className="flex h-full flex-col p-5">
      <PanelHeader
        title="Upcoming"
        linkLabel="Calendar"
        href={`${ACC_BASE}/calendar`}
      />

      {tasks.length === 0 ? (
        <p className="py-12 text-center text-[15px] text-muted">
          Nothing is due in this period.
        </p>
      ) : (
        <ul className="mt-4 space-y-6">
          {tasks.map((task) => {
            const { icon: Icon, chip } = UPCOMING_STYLE[task.kind];

            return (
              <li key={task.id} className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${chip}`}
                >
                  <Icon className="h-[18px] w-[18px]" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-semibold text-ink">
                    {task.title}
                  </span>
                  {task.detail && (
                    <span className="mt-0.5 block truncate text-[13px] text-muted">
                      {task.detail}
                    </span>
                  )}
                </span>

                <span className="shrink-0 text-right">
                  <span className="block text-[13px] text-gray-600">
                    {shortDate(task.date)}
                  </span>
                  {task.amount !== undefined && (
                    <span className="mt-0.5 block text-[13px] text-muted">
                      {lkrK(task.amount)}
                    </span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
