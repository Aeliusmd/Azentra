import type { Metadata } from "next";

import { AccCalendarView } from "@/components/acc/calendar/calendar-view";

export const metadata: Metadata = {
  title: "Calendar",
};

export default function AccountantCalendarPage() {
  return <AccCalendarView />;
}
