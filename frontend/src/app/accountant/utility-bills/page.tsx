import type { Metadata } from "next";

import { AccUtilityBillsView } from "@/components/acc/billing/utility-bills-view";

export const metadata: Metadata = {
  title: "Utility Bills",
};

export default function AccountantUtilityBillsPage() {
  return <AccUtilityBillsView />;
}
