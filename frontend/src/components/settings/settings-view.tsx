"use client";

import { useState } from "react";
import { Bell, Building2, ChevronDown } from "lucide-react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Toggle } from "@/components/ui/toggle";
import { recordAudit } from "@/lib/audit-store";
import {
  LANGUAGES,
  NOTIFICATION_CHANNELS,
  TIMEZONES,
  featureToggles as toggleDefaults,
  notificationRules as ruleDefaults,
  propertySettings as propertyDefaults,
  type PropertySettings,
} from "@/lib/settings-data";

const CONTROL =
  "w-full rounded-md border border-hairline bg-white px-3.5 py-2.5 text-sm text-ink " +
  "outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20";

function Label({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-[13px] text-ink">
      {children}
    </label>
  );
}

function Select({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`${CONTROL} appearance-none pr-9`}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400"
        />
      </div>
    </div>
  );
}

function Footer({
  onCancel,
  onSave,
}: {
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <div className="flex justify-end gap-3 border-t border-hairline px-6 py-5">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-md border border-hairline px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onSave}
        className="rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        Save Changes
      </button>
    </div>
  );
}

export function SettingsView() {
  const [tab, setTab] = useState<"property" | "notifications">("property");
  const [saved, setSaved] = useState<string | null>(null);

  // Working copies; Cancel restores the last saved state.
  const [property, setProperty] = useState<PropertySettings>(propertyDefaults);
  const [savedProperty, setSavedProperty] = useState(propertyDefaults);
  const [toggles, setToggles] = useState(toggleDefaults);
  const [savedToggles, setSavedToggles] = useState(toggleDefaults);
  const [rules, setRules] = useState(ruleDefaults);
  const [savedRules, setSavedRules] = useState(ruleDefaults);

  function flash(message: string) {
    setSaved(message);
    window.setTimeout(() => setSaved(null), 2500);
  }

  function updateProperty<K extends keyof PropertySettings>(
    field: K,
    value: PropertySettings[K],
  ) {
    setProperty((current) => ({ ...current, [field]: value }));
  }

  function saveProperty() {
    setSavedProperty(property);
    setSavedToggles(toggles);
    const on = toggles.filter((toggle) => toggle.enabled).length;
    recordAudit({
      action: "Property Settings Updated",
      module: "Settings",
      details: `${property.name} (${property.code}) saved — ${on} of ${toggles.length} features enabled`,
    });
    flash("Property settings saved.");
  }

  function saveNotifications() {
    setSavedRules(rules);
    const enabled = rules.reduce(
      (total, rule) =>
        total + NOTIFICATION_CHANNELS.filter((c) => rule.channels[c]).length,
      0,
    );
    recordAudit({
      action: "Notification Settings Updated",
      module: "Settings",
      details: `${enabled} channel subscriptions active across ${rules.length} events`,
    });
    flash("Notification settings saved.");
  }

  const tabs = [
    { key: "property" as const, label: "Property Settings", icon: Building2 },
    { key: "notifications" as const, label: "Notifications", icon: Bell },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Property Settings"
        subtitle="Configure property-wide settings and preferences"
      />

      <Card className="p-2">
        <div role="tablist" aria-label="Settings section" className="flex gap-1">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 rounded-md px-4 py-2.5 text-[13px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none ${
                tab === key
                  ? "bg-brand text-white"
                  : "text-gray-600 hover:bg-gray-50 hover:text-ink"
              }`}
            >
              <Icon aria-hidden="true" className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </Card>

      {saved && (
        <p
          role="status"
          className="rounded-md border border-green-200 bg-green-50 px-4 py-2.5 text-[13px] text-green-800"
        >
          {saved}
        </p>
      )}

      {tab === "property" ? (
        <Card>
          <div className="px-6 py-6">
            <h2 className="text-[15px] font-semibold text-ink">
              Property Information
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="property-name">Property Name</Label>
                <input
                  id="property-name"
                  value={property.name}
                  onChange={(event) => updateProperty("name", event.target.value)}
                  className={CONTROL}
                />
              </div>
              <div>
                <Label htmlFor="property-code">Property Code</Label>
                <input
                  id="property-code"
                  value={property.code}
                  onChange={(event) => updateProperty("code", event.target.value)}
                  className={CONTROL}
                />
              </div>
            </div>

            <div className="mt-5">
              <Label htmlFor="property-address">Address</Label>
              <textarea
                id="property-address"
                rows={2}
                value={property.address}
                onChange={(event) =>
                  updateProperty("address", event.target.value)
                }
                className={`${CONTROL} resize-none`}
              />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="property-phone">Contact Phone</Label>
                <input
                  id="property-phone"
                  type="tel"
                  value={property.phone}
                  onChange={(event) =>
                    updateProperty("phone", event.target.value)
                  }
                  className={CONTROL}
                />
              </div>
              <div>
                <Label htmlFor="property-email">Contact Email</Label>
                <input
                  id="property-email"
                  type="email"
                  value={property.email}
                  onChange={(event) =>
                    updateProperty("email", event.target.value)
                  }
                  className={CONTROL}
                />
              </div>

              <Select
                id="property-language"
                label="Default Language"
                value={property.language}
                options={LANGUAGES}
                onChange={(value) => updateProperty("language", value)}
              />
              <Select
                id="property-timezone"
                label="Timezone"
                value={property.timezone}
                options={TIMEZONES}
                onChange={(value) => updateProperty("timezone", value)}
              />
            </div>

            <div className="mt-8 border-t border-hairline pt-6">
              <h3 className="text-[13px] font-medium text-gray-500">
                Feature Toggles
              </h3>

              <ul className="mt-4 space-y-5">
                {toggles.map((toggle) => (
                  <li
                    key={toggle.key}
                    className="flex items-start justify-between gap-6"
                  >
                    <div>
                      <p className="text-[13px] font-semibold text-ink">
                        {toggle.label}
                      </p>
                      <p className="mt-0.5 text-xs text-muted">
                        {toggle.description}
                      </p>
                    </div>
                    <Toggle
                      label={toggle.label}
                      checked={toggle.enabled}
                      onChange={(enabled) =>
                        setToggles((current) =>
                          current.map((item) =>
                            item.key === toggle.key
                              ? { ...item, enabled }
                              : item,
                          ),
                        )
                      }
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Footer
            onCancel={() => {
              setProperty(savedProperty);
              setToggles(savedToggles);
            }}
            onSave={saveProperty}
          />
        </Card>
      ) : (
        <Card>
          <div className="px-6 py-6">
            <h2 className="text-[15px] font-semibold text-ink">
              Notification Settings
            </h2>

            <ul className="mt-5 space-y-5">
              {rules.map((rule) => (
                <li
                  key={rule.key}
                  className="flex flex-wrap items-center justify-between gap-4"
                >
                  <p className="text-[13px] text-ink">{rule.label}</p>

                  <div className="flex items-center gap-4">
                    {NOTIFICATION_CHANNELS.map((channel) => (
                      <label
                        key={channel}
                        className="flex cursor-pointer items-center gap-1.5 text-[13px] text-gray-600"
                      >
                        <input
                          type="checkbox"
                          checked={rule.channels[channel]}
                          onChange={(event) =>
                            setRules((current) =>
                              current.map((item) =>
                                item.key === rule.key
                                  ? {
                                      ...item,
                                      channels: {
                                        ...item.channels,
                                        [channel]: event.target.checked,
                                      },
                                    }
                                  : item,
                              ),
                            )
                          }
                          aria-label={`${channel} for ${rule.label}`}
                          className="h-3.5 w-3.5 accent-brand"
                        />
                        {channel}
                      </label>
                    ))}
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 border-t border-hairline pt-6">
              <button
                type="button"
                className="rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                Configure Templates
              </button>
            </div>
          </div>

          <Footer
            onCancel={() => setRules(savedRules)}
            onSave={saveNotifications}
          />
        </Card>
      )}
    </div>
  );
}
