import type { Metadata } from "next";

import { FsTechnicianListView } from "@/components/fs/technicians/technician-list-view";

export const metadata: Metadata = {
  title: "Technician List",
};

export default function FsTechniciansPage() {
  return <FsTechnicianListView />;
}
