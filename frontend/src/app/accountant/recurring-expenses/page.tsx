import type { Metadata } from "next";

import { AccRecurringExpensesView } from "@/components/acc/expenses/recurring-expenses-view";

export const metadata: Metadata = {
  title: "Recurring Expenses",
};

export default function AccountantRecurringExpensesPage() {
  return <AccRecurringExpensesView />;
}
