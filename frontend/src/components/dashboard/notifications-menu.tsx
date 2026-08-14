"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { Bell, Check } from "lucide-react";

import { useDismiss } from "@/hooks/use-dismiss";
import { TONE_DOT } from "@/lib/notifications-data";
import {
  markAllRead,
  markRead,
  unreadCount,
  useNotifications,
} from "@/lib/notifications-store";

/** The dropdown is a preview — the full list lives on /admin/notifications. */
const PREVIEW_COUNT = 5;

export function NotificationsMenu() {
  const items = useNotifications();
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);
  const ref = useDismiss<HTMLDivElement>(open, close);

  const unread = unreadCount(items);
  const preview = items.slice(0, PREVIEW_COUNT);

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
          /* Anchoring to the bell would push the panel off the left of a
             phone — the bell sits well inside the right edge. Below `sm` it
             hangs under the header across the screen instead. */
          className="fixed inset-x-4 top-[80px] z-40 overflow-hidden rounded-xl border border-hairline bg-white shadow-lg sm:absolute sm:inset-x-auto sm:top-full sm:right-0 sm:mt-2 sm:w-[330px]"
        >
          <div className="flex items-center justify-between gap-4 border-b border-hairline px-4 py-3.5">
            <h2 className="text-[15px] font-bold text-ink">Notifications</h2>
            <button
              type="button"
              onClick={markAllRead}
              disabled={unread === 0}
              className="text-[13px] font-medium text-link transition-colors hover:text-link-dark disabled:cursor-not-allowed disabled:text-gray-400 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
            >
              Mark all read
            </button>
          </div>

          {items.length === 0 ? (
            <p className="px-4 py-8 text-center text-[13px] text-muted">
              You’re all caught up.
            </p>
          ) : (
            <ul className="max-h-[340px] overflow-y-auto">
              {preview.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => markRead(item.id)}
                    className={`flex w-full gap-2.5 px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                      item.read ? "" : "bg-blue-50/40"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                        item.read ? "bg-gray-300" : TONE_DOT[item.tone]
                      }`}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span
                          className={`text-[15px] ${
                            item.read
                              ? "font-medium text-gray-500"
                              : "font-semibold text-ink"
                          }`}
                        >
                          {item.title}
                        </span>
                        {item.read && (
                          <span className="flex shrink-0 items-center gap-0.5 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                            <Check aria-hidden="true" className="h-2.5 w-2.5" />
                            Read
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 block text-[13px] text-muted">
                        {item.detail}
                      </span>
                      <span className="mt-0.5 block text-[13px] text-gray-400">
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
              href="/admin/notifications"
              onClick={close}
              className="block px-4 py-3.5 text-center text-[13px] font-medium text-link transition-colors hover:text-link-dark"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
