import type { Metadata } from "next";

import { BookingsView } from "@/components/pm/bookings/bookings-view";

export const metadata: Metadata = {
  title: "Facility Bookings",
};

export default function FacilityBookingPage() {
  return <BookingsView />;
}
