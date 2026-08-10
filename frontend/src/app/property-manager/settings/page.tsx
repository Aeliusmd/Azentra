import type { Metadata } from "next";

import { PmSettingsView } from "@/components/pm/settings/settings-view";

export const metadata: Metadata = {
  title: "Property Settings",
};

export default function SettingsPage() {
  return <PmSettingsView />;
}
