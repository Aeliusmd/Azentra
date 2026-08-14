import type { Metadata } from "next";

import { FsProfileView } from "@/components/fs/profile/profile-view";

export const metadata: Metadata = {
  title: "Profile",
};

export default function FsProfilePage() {
  return <FsProfileView />;
}
