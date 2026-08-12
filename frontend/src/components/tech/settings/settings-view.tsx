"use client";

import { Bell, Lock, SlidersHorizontal, type LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import {
  setSetting,
  useTechSettings,
  type SettingKey,
} from "@/lib/tech/settings-store";
import { showToast } from "@/lib/tech/toast-store";

type Row = { key: SettingKey; label: string; detail: string };

const NOTIFICATION_ROWS: Row[] = [
  {
    key: "pushNotifications",
    label: "Push Notifications",
    detail: "Receive notifications for new jobs and updates",
  },
  {
    key: "emailAlerts",
    label: "Email Alerts",
    detail: "Get job alerts via email",
  },
  {
    key: "smsAlerts",
    label: "SMS Alerts",
    detail: "Receive urgent alerts via SMS",
  },
  {
    key: "soundAlerts",
    label: "Sound Alerts",
    detail: "Play sound for emergency notifications",
  },
];

const WORK_ROWS: Row[] = [
  {
    key: "autoStartJob",
    label: "Auto-Start Job",
    detail: "Automatically start job when you accept",
  },
  {
    key: "darkMode",
    label: "Dark Mode",
    detail: "Use dark theme for the interface",
  },
];

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-5">
      <h2 className="flex items-center gap-2 text-[15px] font-semibold text-ink">
        <Icon aria-hidden="true" className="h-4 w-4 text-gray-500" />
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </Card>
  );
}

function SettingRows({
  rows,
  values,
}: {
  rows: Row[];
  values: Record<SettingKey, boolean>;
}) {
  return (
    <ul className="space-y-4">
      {rows.map((row) => (
        <li key={row.key} className="flex items-center justify-between gap-6">
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-ink">{row.label}</p>
            <p className="mt-0.5 text-[13px] text-muted">{row.detail}</p>
          </div>
          <Toggle
            label={row.label}
            checked={values[row.key]}
            onChange={(checked) => setSetting(row.key, checked)}
          />
        </li>
      ))}
    </ul>
  );
}

export function SettingsView() {
  const settings = useTechSettings();

  return (
    <div className="max-w-[680px] space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-ink">Settings</h1>
        <p className="mt-1 text-[13px] text-muted">
          Manage your preferences and app settings
        </p>
      </div>

      <Section icon={Bell} title="Notifications">
        <SettingRows rows={NOTIFICATION_ROWS} values={settings} />
      </Section>

      <Section icon={SlidersHorizontal} title="Work Preferences">
        <SettingRows rows={WORK_ROWS} values={settings} />
      </Section>

      <Section icon={Lock} title="Security">
        <button
          type="button"
          onClick={() => showToast("Password reset link sent to your email")}
          className="rounded-md bg-[#4a7fb5] px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#3f6d9d] focus-visible:ring-2 focus-visible:ring-[#4a7fb5]/40 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          Change Password
        </button>
      </Section>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => showToast("Settings saved")}
          className="rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}