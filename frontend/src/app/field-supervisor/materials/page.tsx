import type { Metadata } from "next";

import { FsMaterialsView } from "@/components/fs/materials/materials-view";

export const metadata: Metadata = {
  title: "Materials",
};

export default function FsMaterialsPage() {
  return <FsMaterialsView />;
}
