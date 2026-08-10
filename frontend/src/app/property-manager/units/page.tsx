import type { Metadata } from "next";

import { UnitsView } from "@/components/pm/units/units-view";

export const metadata: Metadata = {
  title: "Units Overview",
};

export default function UnitsPage() {
  return <UnitsView />;
}
