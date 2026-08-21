import type { Metadata } from "next";

import { AccProfileView } from "@/components/acc/profile/profile-view";

export const metadata: Metadata = {
  title: "Profile",
};

export default function AccountantProfilePage() {
  return <AccProfileView />;
}
