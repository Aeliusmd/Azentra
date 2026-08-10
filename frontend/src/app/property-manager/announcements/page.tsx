import type { Metadata } from "next";

import { AnnouncementsView } from "@/components/pm/announcements/announcements-view";

export const metadata: Metadata = {
  title: "Announcements",
};

export default function AnnouncementsPage() {
  return <AnnouncementsView />;
}
