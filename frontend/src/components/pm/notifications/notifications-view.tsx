"use client";

import { useMemo, useState } from "react";
import { CheckCheck } from "lucide-react";

import { Pill } from "@/components/pm/ui/pill";
import {
  SEVERITY_DOT,
  SEVERITY_FILTERS,
  SEVERITY_TONE,
  markAllRead,
  markRead,
  unreadCount,
  usePmNotifications,
  type PmNotification,
} from "@/lib/pm/notifications-store";

type Filter = "All" | "Unread" | (typeof SEVERITY_FILTERS)[number];

const FILTERS: Filter[] = ["All", "Unread", ...SEVERITY_FILTERS];

function matches(item: PmNotification, filter: Filter) {
  if (filter === "All") return true;
  if (filter === "Unread") return !item.read;
  return item.severity === filter;
}

export function NotificationsView() {
  const items = usePmNotifications();
  const [filter, setFilter] = useState<Filter>("All");

  const unread = unreadCount(items);
  const visible = useMemo(
    () => items.filter((item) => matches(item, filter)),
    [items, filter],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[32px] leading-tight font-bold text-ink">
            Notifications
          </h1>
          <p className="mt-1 text-[17px] text-muted">
            {unread} unread notification{unread === 1 ? "" : "s"}
          </p>
        </div>

        <button
          type="button"
          onClick={markAllRead}
          disabled={unread === 0}
          className="flex items-center gap-2 text-[17px] font-semibold text-brand transition-colors hover:text-brand-dark disabled:cursor-not-allowed disabled:text-gray-400 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
        >
          <CheckCheck aria-hidden="true" className="h-5 w-5" />
          Mark All Read
        </button>
      </div>

      <div
        role="group"
        aria-label="Filter notifications"
        className="flex flex-wrap items-center gap-2.5"
      >
        {FILTERS.map((option) => {
          const count = items.filter((item) => matches(item, option)).length;
          const selected = option === filter;

          return (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              aria-pressed={selected}
              className={`rounded-lg px-4 py-2 text-[15px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none ${
                selected
                  ? "bg-brand text-white"
                  : "border border-hairline bg-white text-ink hover:bg-gray-50"
              }`}
            >
              {option}{" "}
              <span className={selected ? "text-white/80" : "text-gray-400"}>
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <p className="rounded-xl border border-hairline bg-white px-6 py-12 text-center text-[15px] text-muted">
          Nothing to show here.
        </p>
      ) : (
        <ul className="space-y-4">
          {visible.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => markRead(item.id)}
                className={`relative w-full rounded-xl border bg-white px-6 py-5 text-left transition-colors hover:bg-gray-50/70 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none ${
                  item.read ? "border-hairline" : "border-brand/50"
                }`}
              >
                {!item.read && (
                  <span
                    aria-label="Unread"
                    className="absolute top-6 right-6 h-2.5 w-2.5 rounded-full bg-brand"
                  />
                )}

                <span className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${SEVERITY_DOT[item.severity]}`}
                  />

                  <span className="min-w-0 flex-1">
                    <span
                      className={`block text-[17px] text-ink ${
                        item.read ? "font-normal" : "font-bold"
                      }`}
                    >
                      {item.title}
                    </span>
                    <span className="mt-1 block text-[15px] text-gray-600">
                      {item.detail}
                    </span>

                    <span className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <span className="text-[15px] text-gray-400">
                        {item.time}
                      </span>
                      <Pill tone={SEVERITY_TONE[item.severity]}>
                        {item.severity}
                      </Pill>
                    </span>
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
