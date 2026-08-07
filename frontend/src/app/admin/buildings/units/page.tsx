import type { Metadata } from "next";

import { UnitsView } from "@/components/buildings/units-view";
import { AddButton } from "@/components/ui/add-button";
import { PageHeader } from "@/components/ui/page-header";
import { towerNames, units } from "@/lib/buildings-data";

export const metadata: Metadata = {
  title: "Unit Management",
};

export default function UnitsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Unit Management"
        subtitle="Manage individual residential units"
        backHref="/admin/buildings"
        backLabel="Back to Building Management"
        action={<AddButton href="/admin/buildings/units/new" label="Add Unit" />}
      />

      <UnitsView units={units} towerNames={towerNames} />
    </div>
  );
}
