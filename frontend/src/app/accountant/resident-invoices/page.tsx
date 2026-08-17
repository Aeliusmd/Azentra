import type { Metadata } from "next";

import { AccResidentInvoicesView } from "@/components/acc/invoices/resident-invoices-view";

export const metadata: Metadata = {
  title: "Resident Invoices",
};

export default function AccountantResidentInvoicesPage() {
  return <AccResidentInvoicesView />;
}
