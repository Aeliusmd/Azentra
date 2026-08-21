import type { Metadata } from "next";

import { ResFacilitiesView } from "@/components/res/facilities/facilities-view";

export const metadata: Metadata = {
  title: "Facilities",
};

export default function ResidentFacilitiesPage() {
  return <ResFacilitiesView />;
}
