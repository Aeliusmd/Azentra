"use client";

import { useState } from "react";
import { Bell, Building2, Users, Wrench } from "lucide-react";

import { Pill } from "@/components/pm/ui/pill";
import { PmPageHeader } from "@/components/pm/ui/pm-page-header";
import { Toggle } from "@/components/ui/toggle";
import {
  NOTIFICATION_CHANNELS,
  VENDOR_TIERS,
  autoApproveLimit,
  communityFeatures as communityDefaults,
  maintenanceFeatures as maintenanceDefaults,
  managedFacilities,
  notificationRules as ruleDefaults,
  propertyInfo as propertyDefaults,
  slaTimelines as slaDefaults,
  type PropertyInfo,
  type SlaTone,
} from "@/lib/pm/settings-data";

const CONTROL =
  "w-full rounded-lg border border-hairline bg-white px-4 py-3 text-[15px] text-ink " +
  "placeholder:text-gray-400 outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20";

const TABS = [
  { key: "property", label: "Property Info", icon: Building2 },
  { key: "maintenance", label: "Maintenance", icon: Wrench },
  { key: "community", label: "Community", icon: Users },
  { key: "notifications", label: "Notifications", icon: Bell },
] as const;

type TabKey = (typeof TABS)[number]["key"];

/** Tinted tile per SLA priority — box, caption, and figure colours. */
const SLA_TONES: Record<
  SlaTone,
  { box: string; label: string; value: string }
> = {
  red: {
    box: "border-rose-100 bg-rose-50/70",
    label: "text-rose-500",
    value: "text-rose-700",
  },
  amber: {
    box: "border-amber-100 bg-amber-50/70",
    label: "text-amber-600",
    value: "text-amber-700",
  },
  green: {
    box: "border-green-100 bg-green-50/70",
    label: "text-green-600",
    value: "text-green-700",
  },
  slate: {
    box: "border-gray-200 bg-gray-50",
    label: "text-gray-500",
    value: "text-[#1b3a5c]",
  },
};

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-[15px] font-medium text-ink"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={CONTROL}
      />
    </div>
  );
}

/** Labelled switch row used by the Maintenance and Community panels. */
function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <li className="flex items-start justify-between gap-6">
      <div>
        <p className="text-[15px] font-medium text-ink">{label}</p>
        <p className="mt-0.5 text-[13px] text-muted">{description}</p>
      </div>
      <Toggle label={label} checked={checked} onChange={onChange} />
    </li>
  );
}

function Panel({
  title,
  children,
  onCancel,
  onSave,
}: {
  title: string;
  children: React.ReactNode;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <section className="rounded-xl border border-hairline bg-white">
      <div className="px-7 py-7">
        <h2 className="text-[19px] font-bold text-ink">{title}</h2>
        <div className="mt-6">{children}</div>
      </div>

      <div className="flex flex-wrap justify-end gap-3 border-t border-hairline px-7 py-5">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-hairline px-6 py-3 text-[15px] font-medium text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          className="rounded-lg bg-brand px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          Save Changes
        </button>
      </div>
    </section>
  );
}

export function PmSettingsView() {
  const [tab, setTab] = useState<TabKey>("property");
  const [saved, setSaved] = useState<string | null>(null);

  // Working copies; Cancel restores the last saved state.
  const [property, setProperty] = useState<PropertyInfo>(propertyDefaults);
  const [savedProperty, setSavedProperty] = useState(propertyDefaults);
  const [maintenance, setMaintenance] = useState(maintenanceDefaults);
  const [savedMaintenance, setSavedMaintenance] = useState(maintenanceDefaults);
  const [sla, setSla] = useState(slaDefaults);
  const [savedSla, setSavedSla] = useState(slaDefaults);
  const [editingSla, setEditingSla] = useState(false);
  const [quoteLimit, setQuoteLimit] = useState(autoApproveLimit);
  const [savedQuoteLimit, setSavedQuoteLimit] = useState(autoApproveLimit);
  const [community, setCommunity] = useState(communityDefaults);
  const [savedCommunity, setSavedCommunity] = useState(communityDefaults);
  const [rules, setRules] = useState(ruleDefaults);
  const [savedRules, setSavedRules] = useState(ruleDefaults);

  function flash(message: string) {
    setSaved(message);
    window.setTimeout(() => setSaved(null), 2500);
  }

  function updateProperty<K extends keyof PropertyInfo>(
    field: K,
    value: PropertyInfo[K],
  ) {
    setProperty((current) => ({ ...current, [field]: value }));
  }

  function toggleMaintenanceFeature(key: string, enabled: boolean) {
    setMaintenance((current) =>
      current.map((feature) =>
        feature.key === key ? { ...feature, enabled } : feature,
      ),
    );
  }

  function updateSla(key: string, value: string) {
    setSla((current) =>
      current.map((item) => (item.key === key ? { ...item, value } : item)),
    );
  }

  function toggleCommunityFeature(key: string, enabled: boolean) {
    setCommunity((current) =>
      current.map((feature) =>
        feature.key === key ? { ...feature, enabled } : feature,
      ),
    );
  }

  return (
    <div className="max-w-[1180px] space-y-6">
      <PmPageHeader
        title="Property Settings"
        subtitle="Configure your property operations and preferences"
      />

      <div className="rounded-xl border border-hairline bg-white p-2">
        <div
          role="tablist"
          aria-label="Settings section"
          className="flex flex-wrap gap-1"
        >
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 rounded-lg px-5 py-3 text-[15px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none ${
                tab === key
                  ? "bg-brand text-white"
                  : "text-gray-600 hover:bg-gray-50 hover:text-ink"
              }`}
            >
              <Icon aria-hidden="true" className="h-[18px] w-[18px]" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {saved && (
        <p
          role="status"
          className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-[15px] text-green-800"
        >
          {saved}
        </p>
      )}

      {tab === "property" && (
        <Panel
          title="Property Information"
          onCancel={() => setProperty(savedProperty)}
          onSave={() => {
            setSavedProperty(property);
            flash("Property information saved.");
          }}
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field
              id="pm-property-name"
              label="Property Name"
              value={property.name}
              onChange={(value) => updateProperty("name", value)}
            />
            <Field
              id="pm-property-code"
              label="Property Code"
              value={property.code}
              onChange={(value) => updateProperty("code", value)}
            />

            <div className="sm:col-span-2">
              <label
                htmlFor="pm-property-address"
                className="mb-2 block text-[15px] font-medium text-ink"
              >
                Address
              </label>
              <textarea
                id="pm-property-address"
                rows={2}
                value={property.address}
                onChange={(event) =>
                  updateProperty("address", event.target.value)
                }
                className={`${CONTROL} resize-none`}
              />
            </div>

            <Field
              id="pm-property-phone"
              label="Management Phone"
              type="tel"
              value={property.phone}
              onChange={(value) => updateProperty("phone", value)}
            />
            <Field
              id="pm-property-email"
              label="Management Email"
              type="email"
              value={property.email}
              onChange={(value) => updateProperty("email", value)}
            />
            <Field
              id="pm-office-hours"
              label="Office Hours"
              value={property.officeHours}
              onChange={(value) => updateProperty("officeHours", value)}
            />
            <Field
              id="pm-weekend-hours"
              label="Weekend Hours"
              value={property.weekendHours}
              onChange={(value) => updateProperty("weekendHours", value)}
            />
            <Field
              id="pm-total-units"
              label="Total Units"
              value={property.totalUnits}
              onChange={(value) => updateProperty("totalUnits", value)}
            />
            <Field
              id="pm-build-year"
              label="Build Year"
              value={property.buildYear}
              onChange={(value) => updateProperty("buildYear", value)}
            />
          </div>
        </Panel>
      )}

      {tab === "maintenance" && (
        <Panel
          title="Maintenance Settings"
          onCancel={() => {
            setMaintenance(savedMaintenance);
            setSla(savedSla);
            setQuoteLimit(savedQuoteLimit);
            setEditingSla(false);
          }}
          onSave={() => {
            setSavedMaintenance(maintenance);
            setSavedSla(sla);
            setSavedQuoteLimit(quoteLimit);
            setEditingSla(false);
            flash("Maintenance settings saved.");
          }}
        >
          <div className="space-y-5">
            <section className="rounded-xl border border-hairline px-6 py-6">
              <h3 className="text-[15px] font-bold text-ink">
                Request Handling
              </h3>

              <ul className="mt-5 space-y-5">
                {maintenance.map((feature) => (
                  <ToggleRow
                    key={feature.key}
                    label={feature.label}
                    description={feature.description}
                    checked={feature.enabled}
                    onChange={(enabled) =>
                      toggleMaintenanceFeature(feature.key, enabled)
                    }
                  />
                ))}
              </ul>
            </section>

            <section className="rounded-xl border border-hairline px-6 py-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-[15px] font-bold text-ink">
                  SLA Timelines
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingSla((current) => !current)}
                  className="rounded text-[13px] font-medium text-brand transition-colors hover:text-brand-dark focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
                >
                  {editingSla ? "Done" : "Edit SLA"}
                </button>
              </div>

              <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {sla.map((item) => {
                  const tone = SLA_TONES[item.tone];

                  return (
                    <li
                      key={item.key}
                      className={`rounded-lg border px-4 py-3.5 ${tone.box}`}
                    >
                      <label
                        htmlFor={`pm-sla-${item.key}`}
                        className={`block text-[13px] ${tone.label}`}
                      >
                        {item.label}
                      </label>
                      {editingSla ? (
                        <input
                          id={`pm-sla-${item.key}`}
                          value={item.value}
                          onChange={(event) =>
                            updateSla(item.key, event.target.value)
                          }
                          className="mt-1 w-full rounded-md border border-hairline bg-white px-2.5 py-1.5 text-[15px] font-bold text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                        />
                      ) : (
                        <p
                          className={`mt-1 text-[19px] font-bold ${tone.value}`}
                        >
                          {item.value}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>

            <section className="rounded-xl border border-hairline px-6 py-6">
              <h3 className="text-[15px] font-bold text-ink">
                Vendor Management
              </h3>

              <p className="mt-5 text-[15px] font-medium text-ink">
                Preferred Vendor Tiers
              </p>
              <ul className="mt-2.5 flex flex-wrap gap-2">
                {VENDOR_TIERS.map((tier) => (
                  <li key={tier}>
                    <Pill tone="green">{tier}</Pill>
                  </li>
                ))}
              </ul>

              <label
                htmlFor="pm-quote-limit"
                className="mt-6 block text-[15px] font-medium text-ink"
              >
                Auto-approve Quotes Under
              </label>
              <div className="mt-2.5 flex items-center gap-3">
                <span aria-hidden="true" className="text-[15px] text-muted">
                  $
                </span>
                <input
                  id="pm-quote-limit"
                  type="number"
                  min="0"
                  value={quoteLimit}
                  onChange={(event) => setQuoteLimit(event.target.value)}
                  className={`${CONTROL} w-[120px]`}
                />
                <span className="text-[15px] text-muted">per work order</span>
              </div>
            </section>
          </div>
        </Panel>
      )}

      {tab === "community" && (
        <Panel
          title="Community Settings"
          onCancel={() => setCommunity(savedCommunity)}
          onSave={() => {
            setSavedCommunity(community);
            flash("Community settings saved.");
          }}
        >
          <div className="space-y-5">
            <section className="rounded-xl border border-hairline px-6 py-6">
              <h3 className="text-[15px] font-bold text-ink">Features</h3>

              <ul className="mt-5 space-y-5">
                {community.map((feature) => (
                  <ToggleRow
                    key={feature.key}
                    label={feature.label}
                    description={feature.description}
                    checked={feature.enabled}
                    onChange={(enabled) =>
                      toggleCommunityFeature(feature.key, enabled)
                    }
                  />
                ))}
              </ul>
            </section>

            <section className="rounded-xl border border-hairline px-6 py-6">
              <h3 className="text-[15px] font-bold text-ink">
                Managed Facilities
              </h3>

              <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {managedFacilities.map((facility) => (
                  <li
                    key={facility.id}
                    className="flex items-center justify-between gap-4 rounded-lg border border-hairline px-4 py-3.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[15px] font-semibold text-ink">
                        {facility.name}
                      </p>
                      <p className="mt-0.5 text-[13px] text-muted">
                        {facility.hours}
                      </p>
                    </div>
                    <Pill tone={facility.active ? "green" : "slate"}>
                      {facility.active ? "Active" : "Inactive"}
                    </Pill>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </Panel>
      )}

      {tab === "notifications" && (
        <Panel
          title="Notification Settings"
          onCancel={() => setRules(savedRules)}
          onSave={() => {
            setSavedRules(rules);
            flash("Notification settings saved.");
          }}
        >
          <ul className="space-y-5">
            {rules.map((rule) => (
              <li
                key={rule.key}
                className="flex flex-wrap items-center justify-between gap-4"
              >
                <p className="text-[15px] text-ink">{rule.label}</p>

                <div className="flex items-center gap-5">
                  {NOTIFICATION_CHANNELS.map((channel) => (
                    <label
                      key={channel}
                      className="flex cursor-pointer items-center gap-2 text-[15px] text-gray-600"
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
                        className="h-[18px] w-[18px] accent-brand"
                      />
                      {channel}
                    </label>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </div>
  );
}
