import type { Metadata } from "next";

import { AccBudgetsView } from "@/components/acc/budgets/budgets-view";

export const metadata: Metadata = {
  title: "Budgets",
};

export default function AccountantBudgetsPage() {
  return <AccBudgetsView />;
}
