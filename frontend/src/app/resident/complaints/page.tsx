import type { Metadata } from "next";

import { ResComplaintsView } from "@/components/res/complaints/complaints-view";

export const metadata: Metadata = {
  title: "Complaints",
};

export default function ResidentComplaintsPage() {
  return <ResComplaintsView />;
}
