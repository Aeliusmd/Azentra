import type { Metadata } from "next";

import { AccInvoiceHistoryView } from "@/components/acc/invoices/invoice-history-view";

export const metadata: Metadata = {
  title: "Invoice History",
};

export default function AccountantInvoiceHistoryPage() {
  return <AccInvoiceHistoryView />;
}
