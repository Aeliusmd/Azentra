import type { Metadata } from "next";

import { AccPaymentsView } from "@/components/acc/payments/payments-view";

export const metadata: Metadata = {
  title: "Payments",
};

export default function AccountantPaymentsPage() {
  return <AccPaymentsView />;
}
