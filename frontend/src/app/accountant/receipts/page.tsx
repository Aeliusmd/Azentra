import type { Metadata } from "next";

import { AccReceiptsView } from "@/components/acc/payments/receipts-view";

export const metadata: Metadata = {
  title: "Receipts",
};

export default function AccountantReceiptsPage() {
  return <AccReceiptsView />;
}
