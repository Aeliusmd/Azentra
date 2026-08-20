import type { Metadata } from "next";

import { AccUtilityRatesView } from "@/components/acc/utilities/utility-rates-view";

export const metadata: Metadata = {
  title: "Utility Rates",
};

export default function AccountantUtilityRatesPage() {
  return <AccUtilityRatesView />;
}
