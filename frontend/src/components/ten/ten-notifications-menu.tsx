"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";

import { useDismiss } from "@/hooks/use-dismiss";
import { TEN_BASE } from "@/lib/ten/nav";
import {
  KIND_CHIP,
  KIND_ICON,
  markAllTenRead,
  markTenRead,
  tenUnreadCount,
  useTenNotifications,
} from "@/lib/ten/notifications-store";

/** The dropdown is a preview — the full list lives on the notifications page. */
const PREVIEW_COUNT = 4;

export function TenNotificationsMenu() {
  const items = useTenNotifications();
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);
  const ref = useDismiss<HTMLDivElement>(open, close);

  const unread = tenUnreadCount(items);

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
        <div className="absolute right-0 z-30 mt-2 w-[330px] overflow-hidden rounded-xl border border-hairline bg-white shadow-lg sm:w-[380px]">
          <div className="flex items-center justify-between gap-3 border-b border-hairline px-5 py-4">
            <p className="text-[15px] font-bold text-ink">Notifications</p>
            {unread > 0 && (
              <button
                type="button"
                onClick={markAllTenRead}
                className="text-[13px] font-medium text-link transition-colors hover:text-link-dark focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
              >
                Mark all read
              </button>
            )}
          </div>

          <ul className="max-h-[340px] divide-y divide-hairline overflow-y-auto">
            {items.slice(0, PREVIEW_COUNT).map((item) => {
              const Icon = KIND_ICON[item.kind];

              return (
                <li key={item.id}>
                  <Link
                    href={`${TEN_BASE}/notifications`}
                    onClick={() => {
                      markTenRead(item.id);
                      close();
                    }}
                    className={`flex gap-3 px-5 py-3.5 transition-colors hover:bg-gray-50 ${
                      item.read ? "" : "bg-[#f7fafc]"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${KIND_CHIP[item.kind]}`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] font-semibold text-ink">
                        {item.title}
                      </span>
                      <span className="mt-0.5 block text-[13px] text-muted">
                        {item.detail}
                      </span>
                      <span className="mt-1 block text-xs text-gray-400">
                        {item.time}
                      </span>
                    </span>

                    {!item.read && (
                      <span
                        aria-hidden="true"
                        className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#2e6cad]"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="border-t border-hairline px-5 py-3.5 text-center">
            <Link
              href={`${TEN_BASE}/notifications`}
              onClick={close}
              className="text-[13px] font-medium text-link transition-colors hover:text-link-dark"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
