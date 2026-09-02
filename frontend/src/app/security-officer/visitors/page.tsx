import type { Metadata } from "next";

import { SoVisitorsView } from "@/components/so/visitors/visitors-view";

export const metadata: Metadata = {
  title: "Visitor Management",
};

export default function SecurityOfficerVisitorsPage() {
  return <SoVisitorsView />;
}
