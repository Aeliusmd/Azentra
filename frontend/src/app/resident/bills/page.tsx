import type { Metadata } from "next";

import { ResBillsView } from "@/components/res/bills/bills-view";

export const metadata: Metadata = {
  title: "Bills & Payments",
};

export default function ResidentBillsPage() {
  return <ResBillsView />;
}
