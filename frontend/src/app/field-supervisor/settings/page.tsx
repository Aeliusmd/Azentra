import type { Metadata } from "next";

import { FsSettingsView } from "@/components/fs/settings/settings-view";

export const metadata: Metadata = {
  title: "Settings",
};

export default function FsSettingsPage() {
  return <FsSettingsView />;
}
