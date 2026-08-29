import type { Metadata } from "next";

import { TenFacilitiesView } from "@/components/ten/facilities/facilities-view";

export const metadata: Metadata = {
  title: "Facilities",
};

export default function TenantFacilitiesPage() {
  return <TenFacilitiesView />;
}
