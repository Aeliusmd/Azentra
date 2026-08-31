import type { Metadata } from "next";

import { TenDocumentsView } from "@/components/ten/documents/documents-view";

export const metadata: Metadata = {
  title: "Documents",
};

export default function TenantDocumentsPage() {
  return <TenDocumentsView />;
}
