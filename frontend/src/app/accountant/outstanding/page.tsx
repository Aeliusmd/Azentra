import type { Metadata } from "next";

import { AccOutstandingView } from "@/components/acc/payments/outstanding-view";

export const metadata: Metadata = {
  title: "Outstanding",
};

export default function AccountantOutstandingPage() {
  return <AccOutstandingView />;
}
