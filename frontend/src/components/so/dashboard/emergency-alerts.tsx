import { Panel } from "@/components/so/dashboard/panel";
import { AlertStatusPill } from "@/components/so/ui/status-pill";
import { SO_BASE } from "@/lib/so/nav";
import type { EmergencyAlert } from "@/lib/so/dashboard-data";

/** Card tints, keyed off how serious the alert is rather than how old. */
const TONE = {
  amber: { card: "border-l-amber-400 bg-amber-50/50", dot: "bg-amber-400" },
  rose: { card: "border-l-rose-500 bg-rose-50/50", dot: "bg-rose-500" },
  blue: { card: "border-l-[#4a7fb5] bg-[#eef3f9]/60", dot: "bg-[#4a7fb5]" },
} as const;

/**
 * What is happening right now that a guard has to act on.
 *
 * Ordered as raised, newest first, and never collapsed behind a count — an
 * alert nobody can see is an alert nobody answers.
 */
export function SoEmergencyAlerts({ alerts }: { alerts: EmergencyAlert[] }) {
  return (
    <Panel title="Emergency Alerts" href={`${SO_BASE}/emergency-alerts`}>
      <div className="px-5 pb-5">
        {alerts.length === 0 ? (
          <p className="rounded-lg border border-dashed border-hairline px-4 py-6 text-center text-[13px] text-muted">
            No active alerts on this property.
          </p>
        ) : (
          <ul className="space-y-3">
            {alerts.map((alert) => {
              const tone = TONE[alert.tone];

              return (
                <li
                  key={alert.id}
                  className={`rounded-lg border border-hairline border-l-[3px] px-4 py-3 ${tone.card}`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      aria-hidden="true"
                      className={`h-2 w-2 shrink-0 rounded-full ${tone.dot}`}
                    />
                    <h3 className="text-[14px] font-bold text-ink">
                      {alert.type}
                    </h3>
                    <AlertStatusPill status={alert.status} />
                  </div>

                  <p className="mt-1.5 text-[13px] leading-relaxed text-gray-600">
                    {alert.detail}
                  </p>
                  <p className="mt-1.5 text-[12px] text-muted">
                    {alert.location}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Panel>
  );
}
