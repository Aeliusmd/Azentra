"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";

import { useDismiss } from "@/hooks/use-dismiss";
import {
  TONE_DOT,
  notifications as seed,
  type Notification,
} from "@/lib/notifications-data";

export function NotificationsMenu() {
  const [items, setItems] = useState<Notification[]>(seed);
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);
  const ref = useDismiss<HTMLDivElement>(open, close);

  const unread = items.filter((item) => !item.read).length;

  function markAllRead() {
    setItems((current) => current.map((item) => ({ ...item, read: true })));
  }

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
          className="absolute top-full right-0 z-40 mt-2 w-[330px] overflow-hidden rounded-xl border border-hairline bg-white shadow-lg"
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
            <ul className="max-h-[320px] overflow-y-auto">
              {items.map((item) => (
                <li key={item.id} className="px-4 py-3">
                  <div className="flex gap-2.5">
                    <span
                      aria-hidden="true"
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                        item.read ? "bg-gray-300" : TONE_DOT[item.tone]
                      }`}
                    />
                    <div className="min-w-0">
                      <p
                        className={`text-[15px] ${
                          item.read
                            ? "font-medium text-gray-500"
                            : "font-semibold text-ink"
                        }`}
                      >
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-[13px] text-muted">
                        {item.detail}
                      </p>
                      <p className="mt-0.5 text-[13px] text-gray-400">
                        {item.time}
                      </p>
                    </div>
                  </div>
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
