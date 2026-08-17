import type { Metadata } from "next";

import { AccCommonAreaView } from "@/components/acc/billing/common-area-view";

export const metadata: Metadata = {
  title: "Common Area Bills",
};

export default function AccountantCommonAreaBillsPage() {
  return <AccCommonAreaView />;
}
