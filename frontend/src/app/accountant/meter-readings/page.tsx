import type { Metadata } from "next";

import { AccMeterReadingsView } from "@/components/acc/utilities/meter-readings-view";

export const metadata: Metadata = {
  title: "Meter Readings",
};

export default function AccountantMeterReadingsPage() {
  return <AccMeterReadingsView />;
}
