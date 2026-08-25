"use client";

import { useState } from "react";
import { Car, House, Plus, SquareParking, UserRound } from "lucide-react";

import { AddTenantModal } from "@/components/res/apartment/add-tenant-modal";
import { RegisterVehicleModal } from "@/components/res/apartment/register-vehicle-modal";
import { ResStatusPill } from "@/components/res/ui/status-pill";
import { ResTabBar } from "@/components/res/ui/tab-bar";
import { Card } from "@/components/ui/card";
import {
  leaseRange,
  slotsAvailable,
  vehicleByPlate,
  vehicleLabel,
  vehicleName,
} from "@/lib/res/apartment-data";
import {
  useResParking,
  useResTenants,
  useResVehicles,
} from "@/lib/res/apartment-store";
import { grouped, initialsOf, monthAndYear } from "@/lib/res/format";
import { residentUnit } from "@/lib/res/resident";

type Tab = "Details" | "Parking" | "Vehicles" | "Tenants";

const TILE = "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg";

/** One `label ......... value` pair in the details grid. */
function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6">
      <dt className="text-[14px] text-muted">{label}</dt>
      <dd className="text-right text-[14px] font-bold text-ink">{value}</dd>
    </div>
  );
}

function SectionHeader({
  title,
  aside,
  action,
}: {
  title: string;
  /** Quiet note on the right, e.g. how many bays are spare. */
  aside?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline px-4 py-4 sm:px-5">
      <h2 className="text-[15px] font-bold text-ink">{title}</h2>
      {aside && <p className="text-[13px] text-muted">{aside}</p>}
      {action}
    </div>
  );
}

function AddButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <Plus aria-hidden="true" className="h-4 w-4" />
      {label}
    </button>
  );
}

/**
 * The unit's own record: what it is, the parking it holds, the cars on it and
 * anyone leasing it.
 *
 * The property's facts — unit, tower, floor, area, the bay allocation — are
 * shown, never edited. What this household owns and who it lets to are theirs.
 */
export function ResApartmentView() {
  const parking = useResParking();
  const vehicles = useResVehicles();
  const tenants = useResTenants();

  const [tab, setTab] = useState<Tab>("Details");
  const [vehicleOpen, setVehicleOpen] = useState(false);
  const [tenantOpen, setTenantOpen] = useState(false);

  const spare = slotsAvailable(parking);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[24px] leading-tight font-bold text-ink sm:text-[28px]">
          My Apartment
        </h1>
        <p className="mt-1 text-[14px] text-muted">
          Manage your apartment details, parking, vehicles and tenants
        </p>
      </div>

      <ResTabBar
        fill
        label="My apartment"
        value={tab}
        onChange={(id) => setTab(id as Tab)}
        tabs={[
          { id: "Details", label: "Apartment Details", icon: House },
          { id: "Parking", label: "Parking", icon: SquareParking },
          { id: "Vehicles", label: "Vehicles", icon: Car },
          { id: "Tenants", label: "Tenants", icon: UserRound },
        ]}
      />

      {tab === "Details" && (
        <Card>
          <SectionHeader title="Apartment Details" />
          <dl className="grid grid-cols-1 gap-x-12 gap-y-7 p-5 sm:grid-cols-2 sm:p-6">
            <Fact label="Unit Number" value={residentUnit.number} />
            <Fact label="Tower" value={residentUnit.building} />
            <Fact label="Floor" value={`Floor ${residentUnit.floor}`} />
            <Fact label="Bedrooms" value={String(residentUnit.bedrooms)} />
            <Fact label="Bathrooms" value={String(residentUnit.bathrooms)} />
            <Fact
              label="Area"
              value={`${grouped(residentUnit.area)} sq ft`}
            />
            <Fact label="Property" value={residentUnit.property} />
            <Fact
              label={
                residentUnit.residentType === "Owner"
                  ? "Ownership Since"
                  : "Tenancy Since"
              }
              value={monthAndYear(residentUnit.since)}
            />
          </dl>
        </Card>
      )}

      {tab === "Parking" && (
        <Card>
          <SectionHeader
            title="Parking Allocation"
            aside={`${spare} slot${spare === 1 ? "" : "s"} available`}
          />
          <div className="p-4 sm:p-5">
            {parking.length === 0 ? (
              <p className="py-10 text-center text-[14px] text-muted">
                No bay is allocated to your unit yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {parking.map((slot) => {
                  const car = vehicleByPlate(slot.plate, vehicles);

                  return (
                    <li
                      key={slot.id}
                      className="flex flex-wrap items-center gap-3 rounded-lg border border-hairline px-4 py-4 sm:flex-nowrap sm:gap-4"
                    >
                      <span
                        aria-hidden="true"
                        className={`${TILE} bg-[#eef3f9] text-[#5b7f9c]`}
                      >
                        <SquareParking className="h-5 w-5" />
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="text-[15px] font-bold text-ink">
                          {slot.bay}
                        </p>
                        <p className="mt-0.5 text-[13px] text-muted">
                          {slot.cover} · Slot ID: {slot.id}
                        </p>
                        <p className="mt-0.5 text-[13px] text-muted">
                          {car ? vehicleLabel(car) : "No vehicle assigned"}
                        </p>
                      </div>

                      <ResStatusPill
                        tone={slot.status === "Active" ? "green" : "slate"}
                      >
                        {slot.status}
                      </ResStatusPill>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </Card>
      )}

      {tab === "Vehicles" && (
        <Card>
          <SectionHeader
            title="Registered Vehicles"
            action={
              <AddButton
                label="Add Vehicle"
                onClick={() => setVehicleOpen(true)}
              />
            }
          />
          <ul className="divide-y divide-hairline">
            {vehicles.map((vehicle) => (
              <li
                key={vehicle.id}
                className="flex flex-wrap items-center gap-3 px-4 py-4 sm:flex-nowrap sm:gap-4 sm:px-5"
              >
                <span
                  aria-hidden="true"
                  className={`${TILE} bg-[#eef3f9] text-[#5b7f9c]`}
                >
                  <Car className="h-5 w-5" />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-bold text-ink">
                    {vehicleName(vehicle)}
                  </p>
                  <p className="mt-0.5 text-[13px] text-muted">
                    {vehicle.year}
                    {vehicle.color ? ` · ${vehicle.color}` : ""} ·{" "}
                    {vehicle.plate}
                  </p>
                </div>

                <ResStatusPill
                  tone={vehicle.status === "Active" ? "green" : "amber"}
                >
                  {vehicle.status}
                </ResStatusPill>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {tab === "Tenants" && (
        <Card>
          <SectionHeader
            title="Tenants"
            action={
              <AddButton
                label="Add Tenant"
                onClick={() => setTenantOpen(true)}
              />
            }
          />
          {tenants.length === 0 ? (
            <p className="px-6 py-14 text-center text-[14px] text-muted">
              Nobody is leasing your unit.
            </p>
          ) : (
            <ul className="divide-y divide-hairline">
              {tenants.map((tenant) => (
                <li
                  key={tenant.id}
                  className="flex flex-wrap items-center gap-3 px-4 py-4 sm:flex-nowrap sm:gap-4 sm:px-5"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e8eef5] text-[14px] font-semibold text-[#1b3a5c]"
                  >
                    {initialsOf(tenant.name)}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-bold text-ink">
                      {tenant.name}
                    </p>
                    <p className="mt-0.5 truncate text-[13px] text-muted">
                      {tenant.email}
                    </p>
                    <p className="mt-0.5 text-[13px] text-muted">
                      Lease: {leaseRange(tenant)}
                    </p>
                  </div>

                  <ResStatusPill
                    tone={
                      tenant.status === "Active"
                        ? "green"
                        : tenant.status === "Invited"
                          ? "amber"
                          : "slate"
                    }
                  >
                    {tenant.status}
                  </ResStatusPill>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}

      {vehicleOpen && (
        <RegisterVehicleModal onClose={() => setVehicleOpen(false)} />
      )}
      {tenantOpen && <AddTenantModal onClose={() => setTenantOpen(false)} />}
    </div>
  );
}
