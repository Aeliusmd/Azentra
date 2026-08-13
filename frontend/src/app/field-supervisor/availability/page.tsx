import type { Metadata } from "next";

import { FsAvailabilityView } from "@/components/fs/technicians/availability-view";

export const metadata: Metadata = {
  title: "Availability",
};

export default function FsAvailabilityPage() {
  return <FsAvailabilityView />;
}
