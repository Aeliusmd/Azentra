import type { Metadata } from "next";

import { CommonAreasView } from "@/components/common-areas/common-areas-view";
import { facilities } from "@/lib/common-areas-data";

export const metadata: Metadata = {
  title: "Common Area Management",
};

export default function CommonAreasPage() {
  return <CommonAreasView facilities={facilities} />;
}
