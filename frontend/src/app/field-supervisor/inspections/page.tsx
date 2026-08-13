import type { Metadata } from "next";

import { FsInspectionsView } from "@/components/fs/inspections/inspections-view";

export const metadata: Metadata = {
  title: "Inspections",
};

export default function FsInspectionsPage() {
  return <FsInspectionsView />;
}
