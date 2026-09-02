import type { Metadata } from "next";

import { SoIncidentsView } from "@/components/so/incidents/incidents-view";

export const metadata: Metadata = {
  title: "Incident Reports",
};

export default function SecurityOfficerIncidentsPage() {
  return <SoIncidentsView />;
}
