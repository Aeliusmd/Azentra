import type { Metadata } from "next";

import { MaterialsView } from "@/components/tech/materials/materials-view";

export const metadata: Metadata = {
  title: "Materials",
};

export default function MaterialsPage() {
  return <MaterialsView />;
}
