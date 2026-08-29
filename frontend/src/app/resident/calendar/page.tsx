import type { Metadata } from "next";

import { ResCalendarView } from "@/components/res/calendar/calendar-view";

export const metadata: Metadata = {
  title: "Calendar",
};

export default function ResidentCalendarPage() {
  return <ResCalendarView />;
}
