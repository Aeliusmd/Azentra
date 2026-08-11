import type { Metadata } from "next";

import { AvailabilityView } from "@/components/tech/availability/availability-view";

export const metadata: Metadata = {
  title: "Availability",
};

export default function AvailabilityPage() {
  return <AvailabilityView />;
}
