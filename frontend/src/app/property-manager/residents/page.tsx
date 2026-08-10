import type { Metadata } from "next";

import { ResidentsView } from "@/components/pm/residents/residents-view";

export const metadata: Metadata = {
  title: "Residents",
};

export default function ResidentsPage() {
  return <ResidentsView />;
}
