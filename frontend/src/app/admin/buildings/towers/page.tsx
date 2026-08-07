import type { Metadata } from "next";

import { TowersView } from "@/components/buildings/towers-view";
import { towers } from "@/lib/buildings-data";

export const metadata: Metadata = {
  title: "Tower Management",
};

export default function TowersPage() {
  return <TowersView towers={towers} />;
}
