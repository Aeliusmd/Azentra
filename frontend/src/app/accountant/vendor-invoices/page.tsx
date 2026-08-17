import type { Metadata } from "next";

import { AccVendorInvoicesView } from "@/components/acc/invoices/vendor-invoices-view";

export const metadata: Metadata = {
  title: "Vendor Invoices",
};

export default function AccountantVendorInvoicesPage() {
  return <AccVendorInvoicesView />;
}
