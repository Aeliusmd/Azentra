import type { Metadata } from "next";

import { PreventiveView } from "@/components/tech/preventive/preventive-view";

export const metadata: Metadata = {
  title: "Preventive Maintenance",
};

export default function PreventivePage() {
  return <PreventiveView />;
}
