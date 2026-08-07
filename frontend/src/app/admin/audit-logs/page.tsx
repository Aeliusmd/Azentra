import type { Metadata } from "next";

import { AuditLogsView } from "@/components/audit/audit-logs-view";

export const metadata: Metadata = {
  title: "Audit Logs",
};

export default function AuditLogsPage() {
  return <AuditLogsView />;
}
