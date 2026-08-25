import type { Metadata } from "next";

import { ResDocumentsView } from "@/components/res/documents/documents-view";

export const metadata: Metadata = {
  title: "Documents",
};

export default function ResidentDocumentsPage() {
  return <ResDocumentsView />;
}
