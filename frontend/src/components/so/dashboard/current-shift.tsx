import { Card } from "@/components/ui/card";
import {
  securityOfficer,
  shiftLine,
  soFullName,
  soInitials,
} from "@/lib/so/officer";
import { soPropertyName } from "@/lib/so/properties-data";

/**
 * The post this officer is working.
 *
 * Read-only, and deliberately so: the roster is the Property Manager's, and
 * nothing on this card offers to change it.
 */
export function SoCurrentShift() {
  const rows = [
    { label: "Shift", value: shiftLine(securityOfficer.shift) },
    { label: "Property", value: soPropertyName(securityOfficer.propertyId) },
    { label: "Gate", value: securityOfficer.gate },
  ];

  return (
    <Card className="p-5">
      <h2 className="text-[15px] font-bold text-ink">Current Shift</h2>

      <div className="mt-4 flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e8eef5] text-[14px] font-semibold text-[#1b3a5c]"
        >
          {soInitials()}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[15px] font-bold text-ink">
            {soFullName()}
          </span>
          <span className="mt-0.5 block text-[13px] text-muted">
            Security Officer
          </span>
        </span>
      </div>

      <dl className="mt-5 space-y-3 border-t border-hairline pt-4">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-baseline justify-between gap-4"
          >
            <dt className="text-[13px] text-muted">{row.label}</dt>
            <dd className="text-right text-[13px] font-semibold text-ink">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
