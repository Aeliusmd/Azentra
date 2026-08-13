import type { Metadata } from "next";

import { FsAssignmentsView } from "@/components/fs/assignments/assignments-view";

export const metadata: Metadata = {
  title: "Assignments",
};

export default function FsAssignmentsPage() {
  return <FsAssignmentsView />;
}
