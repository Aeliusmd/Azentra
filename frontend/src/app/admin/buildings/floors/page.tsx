import type { Metadata } from "next";

import { FloorsView } from "@/components/buildings/floors-view";
import { AddButton } from "@/components/ui/add-button";
import { PageHeader } from "@/components/ui/page-header";
import { floors, towerNames } from "@/lib/buildings-data";

export const metadata: Metadata = {
  title: "Floor Management",
};

export default function FloorsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Floor Management"
        subtitle="Manage floors across all towers"
        backHref="/admin/buildings"
        backLabel="Back to Building Management"
        action={<AddButton href="/admin/buildings/floors/new" label="Add Floor" />}
      />

      <FloorsView floors={floors} towerNames={towerNames} />
    </div>
  );
}
