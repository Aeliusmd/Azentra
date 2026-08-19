import type { Metadata } from "next";

import { AccExpenseCategoriesView } from "@/components/acc/expenses/expense-categories-view";

export const metadata: Metadata = {
  title: "Expense Categories",
};

export default function AccountantExpenseCategoriesPage() {
  return <AccExpenseCategoriesView />;
}
