import type { Metadata } from "next";

import { TechCalendarView } from "@/components/tech/calendar/calendar-view";

export const metadata: Metadata = {
  title: "Calendar",
};

export default function TechnicianCalendarPage() {
  return <TechCalendarView />;
}
