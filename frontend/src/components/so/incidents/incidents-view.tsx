"use client";

import { useMemo, useState } from "react";
import { Eye, Plus } from "lucide-react";

import { SoIncidentCards } from "@/components/so/incidents/incident-cards";
import { SoIncidentDetailModal } from "@/components/so/incidents/incident-detail-modal";
import {
  IncidentSeverityPill,
  IncidentStatusPill,
} from "@/components/so/incidents/incident-pills";
import { SoNewIncidentModal } from "@/components/so/incidents/new-incident-modal";
import { SoEmptyRows, SoStackedCell, SoTable } from "@/components/so/ui/table";
import { Card } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/search-input";
import { SelectFilter } from "@/components/ui/select-filter";
import {
  INCIDENT_SEVERITIES,
  INCIDENT_STATUSES,
  incidentsAt,
  matchesIncidentQuery,
} from "@/lib/so/incidents-data";
import { setSoIncidentStatus, useSoIncidents } from "@/lib/so/incidents-store";
import { useSelectedSoProperty } from "@/lib/so/properties";

const COLUMNS = [
  { label: "ID" },
  { label: "Type" },
  { label: "Date & Time" },
  { label: "Location" },
  { label: "Severity" },
  { label: "Status" },
  { label: "Actions", align: "right" as const },
];

/**
 * The incident register.
 *
 * Every report the property has, newest first, whatever became of it — a closed
 * incident is still a record, and hiding it behind a filter would make the log
 * less useful than the paper one it replaces. Only an open report offers the
 * Close button, because only an open report has anywhere left to go.
 */
export function SoIncidentsView() {
  const propertyId = useSelectedSoProperty();
  const all = useSoIncidents();

  const [query, setQuery] = useState("");
  const [severity, setSeverity] = useState("");
  const [status, setStatus] = useState("");
  const [newOpen, setNewOpen] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  const incidents = incidentsAt(propertyId, all);

  const visible = useMemo(
    () =>
      incidents.filter(
        (incident) =>
          matchesIncidentQuery(incident, query) &&
          (severity === "" || incident.severity === severity) &&
          (status === "" || incident.status === status),
      ),
    [incidents, query, severity, status],
  );

  // Read live so the dialog follows a report closed from behind it.
  const open = openId
    ? (incidents.find((incident) => incident.id === openId) ?? null)
    : null;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[24px] leading-tight font-bold text-ink sm:text-[26px]">
            Incident Reports
          </h1>
          <p className="mt-1 text-[14px] text-muted">
            Record and manage security incidents
          </p>
        </div>

        <button
          type="button"
          onClick={() => setNewOpen(true)}
          className="flex w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-[#e0554d] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#c74941] focus-visible:ring-2 focus-visible:ring-[#e0554d]/40 focus-visible:ring-offset-2 focus-visible:outline-none sm:w-auto"
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
          New Incident
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchInput
          label="Search incidents"
          placeholder="Search incidents..."
          value={query}
          onChange={setQuery}
          className="flex-1"
        />

        <div className="grid grid-cols-2 gap-3 sm:flex sm:shrink-0">
          <div className="sm:w-[180px]">
            <SelectFilter
              label="Filter by severity"
              allLabel="All Severities"
              options={[...INCIDENT_SEVERITIES]}
              value={severity}
              onChange={setSeverity}
            />
          </div>
          <div className="sm:w-[180px]">
            <SelectFilter
              label="Filter by status"
              allLabel="All Status"
              options={[...INCIDENT_STATUSES]}
              value={status}
              onChange={setStatus}
            />
          </div>
        </div>
      </div>

      {visible.length === 0 && (
        <Card>
          <SoEmptyRows message="No incidents match this search." />
        </Card>
      )}

      {visible.length > 0 && (
        <div className="md:hidden">
          <SoIncidentCards
            incidents={visible}
            onOpen={(incident) => setOpenId(incident.id)}
          />
        </div>
      )}

      <Card className="hidden md:block">
        {visible.length > 0 && (
          <SoTable columns={COLUMNS} minWidth="min-w-[1080px]">
            {visible.map((incident) => (
              <tr
                key={incident.id}
                className="transition-colors hover:bg-gray-50/70"
              >
                <th
                  scope="row"
                  className="px-5 py-3.5 text-left font-mono text-[13px] font-normal text-gray-500"
                >
                  {incident.id}
                </th>

                <td className="max-w-[260px] px-5 py-3.5">
                  <SoStackedCell
                    primary={
                      <span className="font-semibold">{incident.type}</span>
                    }
                    secondary={
                      <span className="block truncate">
                        {incident.description}
                      </span>
                    }
                  />
                </td>

                <td className="px-5 py-3.5">
                  <SoStackedCell
                    primary={incident.date}
                    secondary={incident.time}
                  />
                </td>

                <td className="px-5 py-3.5 text-[14px] whitespace-nowrap text-gray-600">
                  {incident.location}
                </td>

                <td className="px-5 py-3.5">
                  <IncidentSeverityPill severity={incident.severity} />
                </td>

                <td className="px-5 py-3.5">
                  <IncidentStatusPill status={incident.status} />
                </td>

                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setOpenId(incident.id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-ink focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
                    >
                      <Eye aria-hidden="true" className="h-4 w-4" />
                      <span className="sr-only">View {incident.id}</span>
                    </button>

                    {incident.status === "Investigating" && (
                      <button
                        type="button"
                        onClick={() =>
                          setSoIncidentStatus(incident.id, "Closed")
                        }
                        className="rounded-md bg-green-600 px-3.5 py-1.5 text-[13px] font-semibold text-white transition-colors hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-600/40 focus-visible:ring-offset-2 focus-visible:outline-none"
                      >
                        Close
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </SoTable>
        )}
      </Card>

      {newOpen && (
        <SoNewIncidentModal
          propertyId={propertyId}
          onClose={() => setNewOpen(false)}
        />
      )}
      {open && (
        <SoIncidentDetailModal
          incident={open}
          onClose={() => setOpenId(null)}
        />
      )}
    </div>
  );
}
