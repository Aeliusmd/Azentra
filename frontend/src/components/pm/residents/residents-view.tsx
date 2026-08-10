"use client";

import { useMemo, useState } from "react";
import { Check, Eye } from "lucide-react";

import { ResidentProfileModal } from "@/components/pm/residents/resident-profile-modal";
import { FilterChips } from "@/components/pm/ui/filter-chips";
import { Pill } from "@/components/pm/ui/pill";
import { Card } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/search-input";
import {
  RESIDENT_ROLES,
  RESIDENT_STATUS_TONE,
  residents as seed,
  type Resident,
} from "@/lib/pm/residents-data";
import { initialOf } from "@/lib/users-data";

const FILTERS = ["All", ...RESIDENT_ROLES] as const;

const HEADINGS = [
  "Name",
  "Role",
  "Unit",
  "Tower",
  "Contact",
  "Status",
  "Last Login",
  "Actions",
];

export function ResidentsView() {
  const [list, setList] = useState<Resident[]>(seed);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<string>("All");
  const [viewing, setViewing] = useState<Resident | null>(null);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return list.filter((resident) => {
      if (role !== "All" && resident.role !== role) return false;
      if (!term) return true;
      return (
        resident.name.toLowerCase().includes(term) ||
        resident.email.toLowerCase().includes(term) ||
        resident.unit.toLowerCase().includes(term) ||
        resident.tower.toLowerCase().includes(term) ||
        resident.phone.toLowerCase().includes(term)
      );
    });
  }, [list, query, role]);

  /** Re-activates an inactive or disabled account. */
  function activate(id: string) {
    setList((current) =>
      current.map((resident) =>
        resident.id === id ? { ...resident, status: "active" } : resident,
      ),
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[32px] leading-tight font-bold text-ink">
            Residents
          </h1>
          <p className="mt-1 text-[15px] text-muted">
            Manage community residents and tenants
          </p>
        </div>

        <SearchInput
          label="Search residents"
          placeholder="Search residents..."
          value={query}
          onChange={setQuery}
          className="w-full sm:w-[300px]"
        />
      </div>

      <FilterChips
        label="Filter residents by role"
        options={FILTERS}
        value={role}
        onChange={setRole}
      />

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left">
            <thead>
              <tr className="border-b border-hairline">
                {HEADINGS.map((heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="px-5 py-4 text-xs font-semibold tracking-wide text-gray-500 uppercase"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-hairline">
              {visible.map((resident) => (
                <tr
                  key={resident.id}
                  className="transition-colors hover:bg-gray-50/70"
                >
                  <th scope="row" className="px-5 py-4 text-left font-normal">
                    <span className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-50 text-[15px] font-semibold text-green-700"
                      >
                        {initialOf(resident.name)}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[15px] font-semibold text-ink">
                          {resident.name}
                        </span>
                        <span className="block text-[13px] text-muted">
                          {resident.email}
                        </span>
                      </span>
                    </span>
                  </th>

                  <td className="px-5 py-4">
                    <Pill tone="navy">{resident.role}</Pill>
                  </td>
                  <td className="px-5 py-4 text-[15px] whitespace-nowrap text-gray-600">
                    {resident.unit || "—"}
                  </td>
                  <td className="px-5 py-4 text-[15px] whitespace-nowrap text-gray-600">
                    {resident.tower}
                  </td>
                  <td className="px-5 py-4 text-[15px] whitespace-nowrap text-gray-600">
                    {resident.phone}
                  </td>
                  <td className="px-5 py-4">
                    <Pill tone={RESIDENT_STATUS_TONE[resident.status]}>
                      {resident.status}
                    </Pill>
                  </td>
                  <td className="px-5 py-4 text-[15px] whitespace-nowrap text-gray-600">
                    {resident.lastLogin}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setViewing(resident)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-ink focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
                      >
                        <Eye aria-hidden="true" className="h-[18px] w-[18px]" />
                        <span className="sr-only">
                          View profile of {resident.name}
                        </span>
                      </button>

                      {resident.status !== "active" && (
                        <button
                          type="button"
                          onClick={() => activate(resident.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-brand transition-colors hover:bg-green-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
                        >
                          <Check
                            aria-hidden="true"
                            className="h-[18px] w-[18px]"
                          />
                          <span className="sr-only">
                            Activate {resident.name}
                          </span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {visible.length === 0 && (
          <p className="px-6 py-12 text-center text-[15px] text-muted">
            No residents match your search.
          </p>
        )}
      </Card>

      <ResidentProfileModal
        resident={viewing}
        onClose={() => setViewing(null)}
      />
    </div>
  );
}
