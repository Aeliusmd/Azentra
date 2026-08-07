"use client";

import { useMemo, useState } from "react";
import { Check, CheckCheck } from "lucide-react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { TONE_DOT } from "@/lib/notifications-data";
import {
  markAllRead,
  markRead,
  markUnread,
  unreadCount,
  useNotifications,
} from "@/lib/notifications-store";

const FILTERS = ["All", "Unread", "Read"] as const;
type Filter = (typeof FILTERS)[number];

export function NotificationsView() {
  const items = useNotifications();
  const [filter, setFilter] = useState<Filter>("All");

  const unread = unreadCount(items);

  const visible = useMemo(() => {
    if (filter === "Unread") return items.filter((item) => !item.read);
    if (filter === "Read") return items.filter((item) => item.read);
    return items;
  }, [filter, items]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        subtitle={
          unread > 0
            ? `${unread} unread of ${items.length} notifications`
            : `All ${items.length} notifications read`
        }
        action={
          <button
            type="button"
            onClick={markAllRead}
            disabled={unread === 0}
            className="flex items-center gap-2 rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <CheckCheck aria-hidden="true" className="h-4 w-4" />
            Mark all read
          </button>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((option) => {
          const count =
            option === "Unread"
              ? unread
              : option === "Read"
                ? items.length - unread
                : items.length;
          return (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              aria-pressed={filter === option}
              className={`rounded-md px-3.5 py-2 text-[13px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none ${
                filter === option
                  ? "bg-brand text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {option} ({count})
            </button>
          );
        })}
      </div>

      <Card>
        {visible.length === 0 ? (
          <p className="px-6 py-12 text-center text-[13px] text-muted">
            {filter === "Unread"
              ? "You’re all caught up — nothing unread."
              : "Nothing to show here."}
          </p>
        ) : (
          <ul className="divide-y divide-hairline">
            {visible.map((item) => (
              <li
                key={item.id}
                className={`flex flex-wrap items-start gap-4 px-6 py-4 transition-colors ${
                  item.read ? "" : "bg-blue-50/40"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${
                    item.read ? "bg-gray-300" : TONE_DOT[item.tone]
                  }`}
                />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p
                      className={`text-[15px] ${
                        item.read
                          ? "font-medium text-gray-500"
                          : "font-semibold text-ink"
                      }`}
                    >
                      {item.title}
                    </p>
                    {item.read ? (
                      <span className="flex items-center gap-1 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                        <Check aria-hidden="true" className="h-2.5 w-2.5" />
                        Read
                      </span>
                    ) : (
                      <span className="rounded bg-brand/10 px-1.5 py-0.5 text-[10px] font-medium text-brand-dark">
                        New
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[13px] text-muted">{item.detail}</p>
                  <p className="mt-0.5 text-[13px] text-gray-400">
                    {item.time}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    item.read ? markUnread(item.id) : markRead(item.id)
                  }
                  className="shrink-0 rounded-md border border-hairline px-3 py-1.5 text-[13px] font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-ink focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
                >
                  {item.read ? "Mark unread" : "Mark read"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
