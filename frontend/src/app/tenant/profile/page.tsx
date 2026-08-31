import type { Metadata } from "next";

import { TenProfileView } from "@/components/ten/profile/profile-view";

export const metadata: Metadata = {
  title: "Profile",
};

export default function TenantProfilePage() {
  return <TenProfileView />;
}
