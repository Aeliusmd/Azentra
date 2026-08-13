import type { Metadata } from "next";

import { FsSiteVisitsView } from "@/components/fs/site-visits/site-visits-view";

export const metadata: Metadata = {
  title: "Site Visits",
};

export default function FsSiteVisitsPage() {
  return <FsSiteVisitsView />;
}
