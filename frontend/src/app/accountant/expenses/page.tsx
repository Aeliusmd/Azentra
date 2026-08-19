import type { Metadata } from "next";

import { AccExpensesView } from "@/components/acc/expenses/expenses-view";

export const metadata: Metadata = {
  title: "Expenses",
};

export default function AccountantExpensesPage() {
  return <AccExpensesView />;
}
