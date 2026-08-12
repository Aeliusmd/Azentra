import type { Metadata } from "next";

import { TechProfileView } from "@/components/tech/profile/profile-view";

export const metadata: Metadata = {
  title: "My Profile",
};

export default function TechnicianProfilePage() {
  return <TechProfileView />;
}
