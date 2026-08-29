import type { Metadata } from "next";

import { TenApartmentView } from "@/components/ten/apartment/apartment-view";

export const metadata: Metadata = {
  title: "My Apartment",
};

export default function TenantApartmentPage() {
  return <TenApartmentView />;
}
