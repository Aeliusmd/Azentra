"use client";

import { useState } from "react";
import { BellOff } from "lucide-react";

import { TenTabBar } from "@/components/ten/ui/tab-bar";
import { Card } from "@/components/ui/card";
import {
  markTenRead,
  markAllTenRead,
  notificationsForTab,
  TEN_NOTIFICATION_TABS,
  tenUnreadCount,
  useTenNotifications,
  type TenNotification,
  type TenNotificationTab,
} from "@/lib/ten/notifications-store";

function NotificationRow({ item }: { item: TenNotification }) {
  return (
    <li>
      {/* The whole row is the control: opening a notice is what reads it. */}
      <button
        type="button"
        onClick={() => markTenRead(item.id)}
        aria-label={
          item.read ? item.title : `${item.title} (unread), mark as read`
        }
        className={`w-full rounded-lg border border-hairline px-4 py-4 text-left transition-colors focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none sm:px-5 ${
          item.read
            ? "bg-white hover:bg-gray-50/70"
            : "bg-[#f7f9fb] hover:bg-[#eff3f7]"
        }`}
      >
        <div className="flex items-start gap-2.5">
          {!item.read && (
            <span
              aria-hidden="true"
              className="mt-[7px] h-2 w-2 shrink-0 rounded-full bg-[#2e6cad]"
            />
          )}

          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-bold text-ink">{item.title}</p>
            <p className="mt-1 text-[14px] leading-relaxed text-muted">
              {item.detail}
            </p>
            <p className="mt-1.5 text-[13px] text-gray-400">{item.time}</p>
          </div>
        </div>
      </button>
    </li>
  );
}

/**
 * Everything the property has told this tenant.
 *
 * Read-only apart from marking things read: a notice is raised by something
 * happening elsewhere — a technician assigned, a bill issued, a booking
 * confirmed — and there is no way to write one from here.
 */
export function TenNotificationsView() {
  const items = useTenNotifications();
  const [tab, setTab] = useState<TenNotificationTab>("All");

  const unread = tenUnreadCount(items);
  const visible = notificationsForTab(tab, items);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[24px] leading-tight font-bold text-ink sm:text-[28px]">
            Notifications
          </h1>
          <p className="mt-1 text-[14px] text-muted">
            {unread > 0 ? `${unread} unread` : "All caught up"}
          </p>
        </div>

        <button
          type="button"
          onClick={markAllTenRead}
          disabled={unread === 0}
          className="rounded-lg bg-gray-100 px-4 py-2.5 text-[14px] font-semibold text-ink transition-colors hover:bg-gray-200 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:bg-gray-100"
        >
          Mark all read
        </button>
      </div>

      <TenTabBar
        label="Filter notifications"
        value={tab}
        onChange={(id) => setTab(id as TenNotificationTab)}
        tabs={TEN_NOTIFICATION_TABS.map((id) => ({ id, label: id }))}
      />

      {visible.length === 0 ? (
        <Card className="px-6 py-16 text-center">
          <span
            aria-hidden="true"
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#eef3f9] text-[#5b7f9c]"
          >
            <BellOff className="h-5 w-5" />
          </span>
          <p className="mt-4 text-[17px] font-semibold text-ink">
            Nothing here
          </p>
          <p className="mx-auto mt-1 max-w-[420px] text-[15px] text-muted">
            You have no notifications in this category yet.
          </p>
        </Card>
      ) : (
        <ul className="space-y-3">
          {visible.map((item) => (
            <NotificationRow key={item.id} item={item} />
          ))}
        </ul>
      )}
    </div>
  );
}
