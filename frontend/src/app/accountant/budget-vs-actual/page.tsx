import type { Metadata } from "next";

import { AccBudgetVsActualView } from "@/components/acc/budgets/budget-vs-actual-view";

export const metadata: Metadata = {
  title: "Budget vs Actual",
};

export default function AccountantBudgetVsActualPage() {
  return <AccBudgetVsActualView />;
}
