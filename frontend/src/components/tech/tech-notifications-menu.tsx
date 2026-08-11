"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";

import { useDismiss } from "@/hooks/use-dismiss";
import { TECH_BASE } from "@/lib/tech/nav";
import {
  SEVERITY_DOT,
  markAllRead,
  markRead,
  unreadCount,
  useTechNotifications,
} from "@/lib/tech/notifications-store";

/** The dropdown is a preview — the full list lives on the notifications page. */
const PREVIEW_COUNT = 3;

export function TechNotificationsMenu() {
  const items = useTechNotifications();
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);
  const ref = useDismiss<HTMLDivElement>(open, close);

  const unread = unreadCount(items);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={
          unread > 0 ? `Notifications (${unread} unread)` : "Notifications"
        }
        className="relative rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-50 hover:text-ink focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
      >
        <Bell aria-hidden="true" className="h-[18px] w-[18px]" />
        {unread > 0 && (
          <span
            aria-hidden="true"
            className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500"
          />
        )}
      </button>

      {open && (
        <div
          aria-label="Notifications"
          className="absolute top-full right-0 z-40 mt-2 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-hairline bg-white shadow-lg"
        >
          <div className="flex items-center justify-between gap-4 border-b border-hairline px-5 py-4">
            <h2 className="text-[17px] font-bold text-ink">Notifications</h2>
            <button
              type="button"
              onClick={markAllRead}
              disabled={unread === 0}
              className="text-[15px] font-medium text-link transition-colors hover:text-link-dark disabled:cursor-not-allowed disabled:text-gray-400 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
            >
              Mark all read
            </button>
          </div>

          {items.length === 0 ? (
            <p className="px-5 py-8 text-center text-[15px] text-muted">
              You&rsquo;re all caught up.
            </p>
          ) : (
            <ul className="py-2">
              {items.slice(0, PREVIEW_COUNT).map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => markRead(item.id)}
                    className="flex w-full gap-3 px-5 py-3.5 text-left transition-colors hover:bg-gray-50"
                  >
                    <span
                      aria-hidden="true"
                      className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                        item.read ? "bg-gray-300" : SEVERITY_DOT[item.severity]
                      }`}
                    />
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block text-[15px] ${
                          item.read
                            ? "font-medium text-gray-500"
                            : "font-semibold text-ink"
                        }`}
                      >
                        {item.title}
                      </span>
                      <span className="mt-0.5 block text-[15px] text-muted">
                        {item.detail}
                      </span>
                      <span className="mt-1 block text-[13px] text-gray-400">
                        {item.time}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="border-t border-hairline">
            <Link
              href={`${TECH_BASE}/notifications`}
              onClick={close}
              className="block px-5 py-4 text-center text-[15px] font-medium text-link transition-colors hover:text-link-dark"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
