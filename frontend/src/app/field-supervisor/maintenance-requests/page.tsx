import type { Metadata } from "next";

import { FsMaintenanceRequestsView } from "@/components/fs/maintenance-requests/maintenance-requests-view";

export const metadata: Metadata = {
  title: "Maintenance Requests",
};

export default function FsMaintenanceRequestsPage() {
  return <FsMaintenanceRequestsView />;
}
