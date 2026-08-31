"use client";

import { useState } from "react";
import { Car, CircleAlert, House, SquareParking } from "lucide-react";

import { TenParkingPanel } from "@/components/ten/apartment/parking-panel";
import { TenVehiclesPanel } from "@/components/ten/apartment/vehicles-panel";
import { TenStatusPill } from "@/components/ten/ui/status-pill";
import { TenTabBar } from "@/components/ten/ui/tab-bar";
import { Card } from "@/components/ui/card";
import { grouped, lkr, longDate } from "@/lib/res/format";
import { lease, tenantUnit, unitLine } from "@/lib/ten/tenant";

type Tab = "Details" | "Parking" | "Vehicles";

/** One `label ......... value` pair. Every one on this screen is read-only. */
function Fact({
  label,
  value,
  children,
}: {
  label: string;
  /** Plain text value; pass `children` instead where it needs a badge. */
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-6">
      <dt className="text-[14px] text-muted">{label}</dt>
      <dd className="text-right text-[14px] font-bold text-ink">
        {children ?? value}
      </dd>
    </div>
  );
}

/**
 * The tenant's view of the flat they rent.
 *
 * Everything under Details is the property's record and is shown, never edited:
 * the unit, the lease and who owns it. A tenant occupies this flat, so nothing
 * here offers to change what the flat *is* — the one editable thing on the
 * screen is the tenant's own car, on the Vehicles tab.
 */
export function TenApartmentView() {
  const [tab, setTab] = useState<Tab>("Details");

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[24px] leading-tight font-bold text-ink sm:text-[28px]">
          My Apartment
        </h1>
        <p className="mt-1 text-[14px] text-muted">{unitLine()}</p>
      </div>

      <TenTabBar
        label="My apartment"
        value={tab}
        onChange={(id) => setTab(id as Tab)}
        tabs={[
          { id: "Details", label: "Apartment Details", icon: House },
          { id: "Parking", label: "Parking", icon: SquareParking },
          { id: "Vehicles", label: "Vehicles", icon: Car },
        ]}
      />

      {tab === "Details" && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Card>
            <div className="p-5 sm:p-6">
              <h2 className="text-[15px] font-bold text-ink">
                Apartment Information
              </h2>

              <dl className="mt-5 space-y-5">
                <Fact label="Unit Number" value={tenantUnit.number} />
                <Fact label="Tower" value={tenantUnit.building} />
                <Fact label="Floor" value={`Floor ${tenantUnit.floor}`} />
                <Fact
                  label="Bedrooms"
                  value={`${tenantUnit.bedrooms} Bedrooms`}
                />
                <Fact
                  label="Bathrooms"
                  value={`${tenantUnit.bathrooms} Bathrooms`}
                />
                <Fact label="Area" value={`${grouped(tenantUnit.area)} sq ft`} />
                <Fact label="Property" value={tenantUnit.property} />
              </dl>
            </div>
          </Card>

          <Card>
            <div className="p-5 sm:p-6">
              <h2 className="text-[15px] font-bold text-ink">
                Tenancy Information
              </h2>

              <dl className="mt-5 space-y-5">
                <Fact label="Owner" value={tenantUnit.owner} />
                <Fact label="Owner Phone" value={tenantUnit.ownerPhone} />
                <Fact label="Lease Start" value={longDate(lease.start)} />
                <Fact label="Lease End" value={longDate(lease.end)} />
                <Fact label="Status">
                  <TenStatusPill
                    tone={lease.status === "Active" ? "green" : "amber"}
                  >
                    {lease.status}
                  </TenStatusPill>
                </Fact>
                <Fact label="Monthly Rent" value={lkr(lease.monthlyRent)} />
                <Fact label="Security Deposit" value={lkr(lease.deposit)} />
              </dl>

              {/* The lease is between the tenant and the owner; this portal
                  reports it and does not amend it. */}
              <p className="mt-6 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50/70 px-4 py-3 text-[13px] text-amber-800">
                <CircleAlert
                  aria-hidden="true"
                  className="mt-0.5 h-4 w-4 shrink-0"
                />
                <span>
                  For any changes to the lease agreement, please contact your
                  landlord: {tenantUnit.owner} ({tenantUnit.ownerPhone})
                </span>
              </p>
            </div>
          </Card>
        </div>
      )}

      {tab === "Parking" && <TenParkingPanel />}
      {tab === "Vehicles" && (
        <div className="space-y-4">
          <TenVehiclesPanel />
        </div>
      )}
    </div>
  );
}
