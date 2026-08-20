import type { Metadata } from "next";

import { AccConsumptionView } from "@/components/acc/utilities/consumption-view";

export const metadata: Metadata = {
  title: "Consumption",
};

export default function AccountantConsumptionPage() {
  return <AccConsumptionView />;
}
