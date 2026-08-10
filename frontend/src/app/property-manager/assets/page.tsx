import type { Metadata } from "next";

import { AssetsView } from "@/components/pm/assets/assets-view";

export const metadata: Metadata = {
  title: "Assets",
};

export default function AssetsPage() {
  return <AssetsView />;
}
