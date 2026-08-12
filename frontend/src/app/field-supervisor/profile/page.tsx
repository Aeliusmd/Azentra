import type { Metadata } from "next";

import { FsSectionPlaceholder } from "@/components/fs/ui/section-placeholder";

export const metadata: Metadata = {
  title: "My Profile",
};

export default function FsProfilePage() {
  return (
    <FsSectionPlaceholder
      title="My Profile"
      subtitle="Your supervisor account and assigned properties"
    />
  );
}
