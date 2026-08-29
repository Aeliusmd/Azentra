"use client";

import { useMemo, useState } from "react";

import { ResTabBar } from "@/components/res/ui/tab-bar";
import { Card } from "@/components/ui/card";
import {
  KIND_CHIP,
  KIND_ICON,
  markAllResRead,
  markResRead,
  matchesResTab,
  RES_NOTIFICATION_TABS,
  resUnreadCount,
  useResNotifications,
  type ResNotificationTab,
} from "@/lib/res/notifications-store";

/**
 * Everything the bell has collected, in full.
 *
 * The dropdown shows the first few; this is the same list with the filters, so
 * a resident chasing one thing — every bill, say — can cut straight to it.
 */
export function ResNotificationsView() {
  const items = useResNotifications();
  const [tab, setTab] = useState<ResNotificationTab>("All");

  const unread = resUnreadCount(items);
  const visible = useMemo(
    () => items.filter((item) => matchesResTab(item, tab)),
    [items, tab],
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[24px] leading-tight font-bold text-ink sm:text-[28px]">
            Notifications
          </h1>
          {/* The count is of everything, not of what the filter left. */}
          <p className="mt-1 text-[14px] text-muted">
            {unread} unread notification{unread === 1 ? "" : "s"}
          </p>
        </div>

        <button
          type="button"
          onClick={markAllResRead}
          disabled={unread === 0}
          className="text-[14px] font-medium text-link transition-colors hover:text-link-dark focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none disabled:cursor-not-allowed disabled:text-gray-300"
        >
          Mark all read
        </button>
      </div>

      <ResTabBar
        label="Filter notifications"
        value={tab}
        onChange={(id) => setTab(id as ResNotificationTab)}
        tabs={RES_NOTIFICATION_TABS.map((id) => ({ id, label: id }))}
      />

      {visible.length === 0 ? (
        <Card className="px-6 py-14 text-center">
          <p className="text-[15px] font-semibold text-ink">
            Nothing here{tab === "All" ? "" : ` under ${tab}`}
          </p>
          <p className="mt-1 text-[14px] text-muted">
            Updates about your unit appear here as they happen.
          </p>
        </Card>
      ) : (
        <ul className="space-y-3">
          {visible.map((item) => {
            const Icon = item.icon ?? KIND_ICON[item.kind];

            return (
              <li key={item.id}>
                <Card>
                  <button
                    type="button"
                    onClick={() => markResRead(item.id)}
                    className="flex w-full items-start gap-3 px-4 py-4 text-left transition-colors hover:bg-gray-50/70 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none sm:gap-4 sm:px-5"
                  >
                    <span
                      aria-hidden="true"
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.chip ?? KIND_CHIP[item.kind]}`}
                    >
                      <Icon className="h-[18px] w-[18px]" />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="text-[15px] font-bold text-ink">
                          {item.title}
                        </span>
                        {!item.read && (
                          <>
                            <span className="sr-only">Unread</span>
                            <span
                              aria-hidden="true"
                              className="h-2 w-2 shrink-0 rounded-full bg-[#2e6cad]"
                            />
                          </>
                        )}
                      </span>

                      <span className="mt-1 block text-[15px] text-ink">
                        {item.detail}
                      </span>
                      <span className="mt-1.5 block text-[13px] text-muted">
                        {item.time}
                      </span>
                    </span>
                  </button>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
