import type { Metadata } from "next";

import { AccVendorAccountsView } from "@/components/acc/vendors/vendor-accounts-view";

export const metadata: Metadata = {
  title: "Vendor Accounts",
};

export default function AccountantVendorAccountsPage() {
  return <AccVendorAccountsView />;
}
