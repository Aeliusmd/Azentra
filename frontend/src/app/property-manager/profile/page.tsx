import type { Metadata } from "next";

import { PmProfileView } from "@/components/pm/profile/profile-view";

export const metadata: Metadata = {
  title: "Profile",
};

export default function ProfilePage() {
  return <PmProfileView />;
}
