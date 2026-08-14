"use client";

import { useState } from "react";
import Link from "next/link";

import { SelectField } from "@/components/pm/ui/select-field";
import { Card } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { FS_BASE } from "@/lib/fs/nav";
import {
  CALENDAR_VIEWS,
  saveFsSettings,
  TIMEZONES,
  useFsSettings,
  type FsCalendarView,
  type FsSettings,
} from "@/lib/fs/settings-store";
import { showFsToast } from "@/lib/fs/toast-store";

/** The four alert switches, in the order they read on the page. */
const ALERTS = [
  {
    key: "push",
    label: "Push Notifications",
    detail: "Receive in-app notifications for field operations",
  },
  {
    key: "email",
    label: "Email Alerts",
    detail: "Get email notifications for critical updates",
  },
  {
    key: "emergency",
    label: "Emergency Alerts",
    detail: "Immediate alerts for emergency work orders",
  },
  {
    key: "dailyDigest",
    label: "Daily Digest",
    detail: "Receive a daily summary of field operations",
  },
] as const satisfies readonly {
  key: keyof FsSettings;
  label: string;
  detail: string;
}[];

function SwitchRow({
  label,
  detail,
  checked,
  onChange,
}: {
  label: string;
  detail: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-[15px] font-semibold text-ink">{label}</p>
        <p className="mt-0.5 text-[13px] text-muted">{detail}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} label={label} />
    </div>
  );
}

/**
 * Preferences are edited as a draft and committed on save, so a mis-tapped
 * switch can be walked back by leaving the page.
 */
export function FsSettingsView() {
  const saved = useFsSettings();
  const [draft, setDraft] = useState<FsSettings>(saved);

  function set<K extends keyof FsSettings>(key: K, value: FsSettings[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function handleSave() {
    saveFsSettings(draft);
    showFsToast("Settings saved");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[32px] leading-tight font-bold text-ink">
          Settings
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          Configure your Field Supervisor preferences
        </p>
      </div>

      <div className="max-w-[720px] space-y-5">
        <Card className="space-y-5 p-5">
          <h2 className="text-[17px] font-bold text-ink">Notifications</h2>

          {ALERTS.map((alert) => (
            <SwitchRow
              key={alert.key}
              label={alert.label}
              detail={alert.detail}
              checked={draft[alert.key] as boolean}
              onChange={(value) => set(alert.key, value)}
            />
          ))}
        </Card>

        <Card className="space-y-5 p-5">
          <h2 className="text-[17px] font-bold text-ink">Preferences</h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <SelectField
              id="fs-calendar-view"
              label="Default Calendar View"
              value={draft.calendarView}
              onChange={(value) =>
                set("calendarView", value as FsCalendarView)
              }
              options={CALENDAR_VIEWS}
            />
            <SelectField
              id="fs-timezone"
              label="Timezone"
              value={draft.timezone}
              onChange={(value) => set("timezone", value)}
              options={TIMEZONES}
            />
          </div>

          <SwitchRow
            label="Auto-Assign Work Orders"
            detail="Automatically assign work to available technicians based on skill"
            checked={draft.autoAssign}
            onChange={(value) => set("autoAssign", value)}
          />
        </Card>

        <div className="flex flex-wrap justify-end gap-3">
          <Link
            href={`${FS_BASE}/profile`}
            className="rounded-lg border border-hairline px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
          >
            Back to Profile
          </Link>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
