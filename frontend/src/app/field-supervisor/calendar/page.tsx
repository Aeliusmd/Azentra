import type { Metadata } from "next";

import { FsCalendarView } from "@/components/fs/calendar/calendar-view";

export const metadata: Metadata = {
  title: "Calendar",
};

export default function FsCalendarPage() {
  return <FsCalendarView />;
}
