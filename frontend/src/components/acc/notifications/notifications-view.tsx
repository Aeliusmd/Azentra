"use client";

import { useMemo, useState } from "react";

import { AccStatusChips } from "@/components/acc/ui/status-chips";
import {
  ACC_NOTIFICATION_FILTERS,
  KIND_CHIP,
  KIND_ICON,
  markAllRead,
  markRead,
  matchesAccFilter,
  unreadCount,
  useAccNotifications,
} from "@/lib/acc/notifications-store";

/**
 * Everything the bell has collected, in full.
 *
 * The dropdown shows the first few; this is the same list with the filters, so
 * an accountant chasing one thing — say every budget warning — can cut to it
 * without reading past nine payment receipts.
 */
export function AccNotificationsView() {
  const items = useAccNotifications();
  const [filter, setFilter] = useState<string>("All");

  const unread = unreadCount(items);
  const visible = useMemo(
    () => items.filter((item) => matchesAccFilter(item, filter)),
    [items, filter],
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] leading-tight font-bold text-ink">
            Notifications
          </h1>
          <p className="mt-1 text-[14px] text-muted">
            {unread} unread
            {/* The count is of everything, not of what the filter left. */}
          </p>
        </div>

        <button
          type="button"
          onClick={markAllRead}
          disabled={unread === 0}
          className="text-[14px] font-medium text-link transition-colors hover:text-link-dark disabled:cursor-not-allowed disabled:text-gray-300 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
        >
          Mark all read
        </button>
      </div>

      <AccStatusChips
        label="Filter notifications"
        options={ACC_NOTIFICATION_FILTERS}
        value={filter}
        onChange={setFilter}
      />

      {visible.length === 0 ? (
        <p className="rounded-lg border border-hairline bg-white px-6 py-16 text-center text-[15px] text-muted">
          Nothing here under {filter}.
        </p>
      ) : (
        <ul className="space-y-3">
          {visible.map((item) => {
            const Icon = KIND_ICON[item.kind];

            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => markRead(item.id)}
                  className="flex w-full items-start gap-3 rounded-lg border border-hairline bg-white px-4 py-3.5 text-left shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors hover:bg-gray-50/70 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none sm:gap-4 sm:px-5"
                >
                  <span
                    aria-hidden="true"
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${KIND_CHIP[item.kind]}`}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] font-semibold text-ink">
                      {item.title}
                    </span>
                    <span className="mt-0.5 block text-[13px] text-muted">
                      {item.detail}
                    </span>
                    <span className="mt-1.5 block text-[12px] text-gray-400">
                      {item.time}
                    </span>
                  </span>

                  {!item.read && (
                    <span className="mt-1.5 flex shrink-0 items-center gap-2">
                      <span className="sr-only">Unread</span>
                      <span
                        aria-hidden="true"
                        className="h-2 w-2 rounded-full bg-[#2e6cad]"
                      />
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
