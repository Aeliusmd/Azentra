import type { Metadata } from "next";

import { ResVisitorsView } from "@/components/res/visitors/visitors-view";

export const metadata: Metadata = {
  title: "Visitors",
};

export default function ResidentVisitorsPage() {
  return <ResVisitorsView />;
}
