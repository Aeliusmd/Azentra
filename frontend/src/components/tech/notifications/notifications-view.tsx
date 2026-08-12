"use client";

import { useMemo, useState } from "react";

import { SegmentedFilter } from "@/components/tech/ui/segmented-filter";
import { Card } from "@/components/ui/card";
import {
  KIND_CHIP,
  KIND_ICON,
  markAllRead,
  markRead,
  unreadCount,
  useTechNotifications,
} from "@/lib/tech/notifications-store";

export function NotificationsView() {
  const items = useTechNotifications();
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unread = unreadCount(items);
  const options = useMemo(
    () => [`all (${items.length})`, `unread (${unread})`],
    [items.length, unread],
  );

  const visible = filter === "all" ? items : items.filter((item) => !item.read);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Notifications</h1>
          <p className="mt-1 text-[13px] text-muted">
            Stay updated on your assignments and approvals
          </p>
        </div>

        <button
          type="button"
          onClick={markAllRead}
          disabled={unread === 0}
          className="rounded-lg border border-hairline bg-white px-4 py-2 text-[13px] font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none disabled:cursor-not-allowed disabled:text-gray-400"
        >
          Mark All Read
        </button>
      </div>

      <SegmentedFilter
        label="Filter notifications"
        options={options}
        value={options[filter === "all" ? 0 : 1]}
        onChange={(value) =>
          setFilter(value.startsWith("unread") ? "unread" : "all")
        }
      />

      {visible.length === 0 ? (
        <Card className="px-6 py-16 text-center">
          <p className="text-[15px] font-semibold text-ink">
            You&rsquo;re all caught up
          </p>
          <p className="mt-1 text-[13px] text-muted">
            No unread notifications right now.
          </p>
        </Card>
      ) : (
        <ul className="space-y-3">
          {visible.map((item) => {
            const Icon = KIND_ICON[item.kind];

            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => markRead(item.id)}
                  aria-label={
                    item.read ? item.title : `${item.title} — mark as read`
                  }
                  className={`flex w-full items-start gap-4 rounded-lg border p-4 text-left transition-colors focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none ${
                    item.read
                      ? "border-hairline bg-white hover:bg-gray-50/70"
                      : "border-hairline bg-[#f6f8fb] hover:bg-[#eef2f7]"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${KIND_CHIP[item.kind]}`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="text-[15px] font-bold text-ink">
                        {item.title}
                      </span>
                      {!item.read && (
                        <span
                          aria-hidden="true"
                          className="h-2 w-2 shrink-0 rounded-full bg-[#2e6cad]"
                        />
                      )}
                    </span>
                    <span className="mt-0.5 block text-[13px] text-gray-600">
                      {item.detail}
                    </span>
                    <span className="mt-1.5 block text-[13px] text-gray-400">
                      {item.time}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
