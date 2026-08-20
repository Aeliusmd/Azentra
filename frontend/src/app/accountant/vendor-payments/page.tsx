import type { Metadata } from "next";

import { AccVendorPaymentsView } from "@/components/acc/vendors/vendor-payments-view";

export const metadata: Metadata = {
  title: "Vendor Invoices",
};

export default function AccountantVendorPaymentsPage() {
  return <AccVendorPaymentsView />;
}
