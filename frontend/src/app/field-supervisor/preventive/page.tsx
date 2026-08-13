import type { Metadata } from "next";

import { FsPreventiveView } from "@/components/fs/preventive/preventive-view";

export const metadata: Metadata = {
  title: "Preventive Maintenance",
};

export default function FsPreventivePage() {
  return <FsPreventiveView />;
}
