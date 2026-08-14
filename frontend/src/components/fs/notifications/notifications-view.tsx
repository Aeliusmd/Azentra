"use client";

import { useMemo, useState } from "react";
import { CircleCheck, Info, Siren, TriangleAlert } from "lucide-react";

import { FsFilterChips } from "@/components/fs/ui/filter-chips";
import { Card } from "@/components/ui/card";
import {
  FS_SEVERITIES,
  markAllRead,
  markRead,
  markUnread,
  unreadCount,
  useFsNotifications,
  type FsNotification,
  type FsSeverity,
} from "@/lib/fs/notifications-store";

/** Icon tile per severity — the glyph carries the meaning, not just the tint. */
const SEVERITY_STYLE: Record<
  FsSeverity,
  { icon: typeof Info; tile: string }
> = {
  emergency: { icon: Siren, tile: "bg-[#e0554d] text-white" },
  warning: { icon: TriangleAlert, tile: "bg-[#e8a33d] text-white" },
  info: { icon: Info, tile: "bg-[#3f9e63] text-white" },
  success: { icon: CircleCheck, tile: "bg-[#3f9e63] text-white" },
};

const FILTERS = ["All", "Unread", ...FS_SEVERITIES] as const;

/** `emergency` → `Emergency`, for the chip row only. */
function chipLabel(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function NotificationRow({ item }: { item: FsNotification }) {
  const { icon: Icon, tile } = SEVERITY_STYLE[item.severity];

  return (
    <Card className={item.read ? "" : "border-l-4 border-l-brand"}>
      <button
        type="button"
        onClick={() => (item.read ? markUnread(item.id) : markRead(item.id))}
        aria-label={`${item.title} — mark as ${item.read ? "unread" : "read"}`}
        className="flex w-full items-start gap-3.5 p-4 text-left transition-colors hover:bg-gray-50/70 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
      >
        <span
          aria-hidden="true"
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${tile}`}
        >
          <Icon className="h-[18px] w-[18px]" />
        </span>

        <span className="min-w-0 flex-1">
          <span
            className={`block text-[15px] ${item.read ? "font-medium text-gray-600" : "font-semibold text-ink"}`}
          >
            {item.title}
          </span>
          <span className="mt-0.5 block text-[15px] text-muted">
            {item.detail}
          </span>
        </span>

        <span className="flex shrink-0 items-center gap-2.5 pt-0.5">
          <span className="text-[13px] whitespace-nowrap text-muted">
            {item.time}
          </span>
          {!item.read && (
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-brand"
            />
          )}
        </span>
      </button>
    </Card>
  );
}

/** Everything the portal has raised, newest first, filtered by how it reads. */
export function FsNotificationsView() {
  const items = useFsNotifications();
  const [filter, setFilter] = useState<string>(FILTERS[0]);

  const unread = unreadCount(items);

  const visible = useMemo(
    () =>
      items.filter((item) => {
        if (filter === "All") return true;
        if (filter === "Unread") return !item.read;
        return item.severity === filter;
      }),
    [items, filter],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[32px] leading-tight font-bold text-ink">
            Notifications
          </h1>
          <p className="mt-1 text-[15px] text-muted">
            Stay updated on field operations
          </p>
        </div>

        <button
          type="button"
          onClick={markAllRead}
          disabled={unread === 0}
          className="text-[15px] font-medium text-brand transition-colors hover:text-brand-dark disabled:cursor-not-allowed disabled:text-gray-400 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
        >
          Mark all as read
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <FsFilterChips
          label="Filter notifications"
          options={FILTERS.map(chipLabel)}
          value={chipLabel(filter)}
          onChange={(value) =>
            setFilter(
              FILTERS.find((option) => chipLabel(option) === value) ?? "All",
            )
          }
        />
        <p className="text-[13px] text-muted">
          {unread} unread of {items.length}
        </p>
      </div>

      {visible.length === 0 ? (
        <Card className="px-6 py-16 text-center text-[15px] text-muted">
          Nothing here right now.
        </Card>
      ) : (
        <ul className="space-y-3">
          {visible.map((item) => (
            <li key={item.id}>
              <NotificationRow item={item} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
