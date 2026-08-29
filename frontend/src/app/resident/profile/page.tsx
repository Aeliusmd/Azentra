import type { Metadata } from "next";

import { ResProfileView } from "@/components/res/profile/profile-view";

export const metadata: Metadata = {
  title: "Profile",
};

export default function ResidentProfilePage() {
  return <ResProfileView />;
}
