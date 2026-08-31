import type { Metadata } from "next";

import { TenCalendarView } from "@/components/ten/calendar/calendar-view";

export const metadata: Metadata = {
  title: "Calendar",
};

export default function TenantCalendarPage() {
  return <TenCalendarView />;
}
