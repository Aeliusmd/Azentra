import type { Metadata } from "next";

import { AccGenerateBillsView } from "@/components/acc/billing/generate-bills-view";

export const metadata: Metadata = {
  title: "Generate Bills",
};

export default function AccountantGenerateBillsPage() {
  return <AccGenerateBillsView />;
}
