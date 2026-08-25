import type { Metadata } from "next";

import { ResApartmentView } from "@/components/res/apartment/apartment-view";

export const metadata: Metadata = {
  title: "My Apartment",
};

export default function ResidentApartmentPage() {
  return <ResApartmentView />;
}
