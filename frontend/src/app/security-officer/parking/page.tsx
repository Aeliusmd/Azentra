import type { Metadata } from "next";

import { SoParkingView } from "@/components/so/parking/parking-view";

export const metadata: Metadata = {
  title: "Parking Management",
};

export default function SecurityOfficerParkingPage() {
  return <SoParkingView />;
}
