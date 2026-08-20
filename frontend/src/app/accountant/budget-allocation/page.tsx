import type { Metadata } from "next";

import { AccBudgetAllocationView } from "@/components/acc/budgets/budget-allocation-view";

export const metadata: Metadata = {
  title: "Budget Allocation",
};

export default function AccountantBudgetAllocationPage() {
  return <AccBudgetAllocationView />;
}
