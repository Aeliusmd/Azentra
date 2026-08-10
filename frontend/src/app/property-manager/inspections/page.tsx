import type { Metadata } from "next";

import { InspectionsView } from "@/components/pm/inspections/inspections-view";

export const metadata: Metadata = {
  title: "Inspections",
};

export default function InspectionsPage() {
  return <InspectionsView />;
}
