"use client";

import { useMemo, useState } from "react";
import {
  Building2,
  ClipboardCheck,
  ClipboardList,
  FileText,
  House,
  Lock,
  Megaphone,
  MessageSquare,
  Package,
  Receipt,
  Settings,
  ShieldAlert,
  ShieldUser,
  Truck,
  UserRound,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import {
  AUDIT_MODULES,
  MODULE_TONE,
  initialsOf,
  type AuditModule,
} from "@/lib/audit-data";
import { useAuditLog } from "@/lib/audit-store";

const MODULE_ICON: Record<AuditModule, LucideIcon> = {
  "Work Orders": ClipboardList,
  Billing: Receipt,
  Residents: UserRound,
  Maintenance: Wrench,
  Vendors: Truck,
  Inspections: ClipboardCheck,
  Assets: Package,
  Facilities: Building2,
  Complaints: MessageSquare,
  Reports: FileText,
  Units: House,
  Security: ShieldAlert,
  Announcements: Megaphone,
  Users: Users,
  Roles: ShieldUser,
  Permissions: Lock,
  Settings: Settings,
};

const HEADINGS = [
  "Date & Time",
  "Action",
  "Company",
  "Module",
  "Performed By",
  "Details",
];

export function AuditLogsView() {
  const entries = useAuditLog();
  const [query, setQuery] = useState("");
  const [module, setModule] = useState<AuditModule | "">("");

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return entries.filter((entry) => {
      if (module && entry.module !== module) return false;
      if (!term) return true;
      return (
        entry.action.toLowerCase().includes(term) ||
        entry.details.toLowerCase().includes(term) ||
        entry.company.toLowerCase().includes(term) ||
        entry.performedBy.toLowerCase().includes(term) ||
        entry.module.toLowerCase().includes(term)
      );
    });
  }, [entries, module, query]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs"
        subtitle="View-only access to all property activities"
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <SearchInput
          label="Search activities"
          placeholder="Search activities..."
          value={query}
          onChange={setQuery}
          className="w-full lg:max-w-[280px] lg:shrink-0"
        />

        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <span className="text-[13px] text-gray-500">Filter:</span>
          <button
            type="button"
            onClick={() => setModule("")}
            aria-pressed={module === ""}
            className={`rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none ${
              module === ""
                ? "bg-brand text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All Modules
          </button>
          {AUDIT_MODULES.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setModule(name)}
              aria-pressed={module === name}
              className={`rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none ${
                module === name
                  ? "bg-brand text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        <p className="text-[13px] whitespace-nowrap text-muted lg:shrink-0">
          Showing {visible.length} of {entries.length} entries
        </p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left">
            <thead>
              <tr className="border-b border-hairline">
                {HEADINGS.map((heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="px-5 py-4 text-xs font-medium text-muted"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-hairline">
              {visible.map((entry) => {
                const Icon = MODULE_ICON[entry.module];
                const [date, time] = entry.timestamp.split(" ");

                return (
                  <tr
                    key={entry.id}
                    className="align-top transition-colors hover:bg-gray-50/70"
                  >
                    <td className="px-5 py-4 text-[12px] whitespace-nowrap text-gray-500">
                      <div className="font-medium text-gray-600">{date}</div>
                      <div>{time}</div>
                    </td>

                    <th scope="row" className="px-5 py-4 text-left font-normal">
                      <span className="flex items-start gap-2.5">
                        <span
                          aria-hidden="true"
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${MODULE_TONE[entry.module]}`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-[13px] font-semibold text-ink">
                          {entry.action}
                        </span>
                      </span>
                    </th>

                    <td className="max-w-[150px] truncate px-5 py-4 text-[13px] text-gray-600">
                      {entry.company}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium whitespace-nowrap ${MODULE_TONE[entry.module]}`}
                      >
                        {entry.module}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="flex items-center gap-2">
                        <span
                          aria-hidden="true"
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1b3a5c] text-[10px] font-semibold text-white"
                        >
                          {initialsOf(entry.performedBy)}
                        </span>
                        <span className="text-[13px] text-gray-700">
                          {entry.performedBy}
                        </span>
                      </span>
                    </td>

                    <td className="px-5 py-4 text-[13px] text-gray-600">
                      {entry.details}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {visible.length === 0 && (
          <p className="px-6 py-10 text-center text-[13px] text-muted">
            No activities match your filters.
          </p>
        )}
      </Card>
    </div>
  );
}
