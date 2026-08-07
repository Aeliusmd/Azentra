import type { Metadata } from "next";

import { RolesView } from "@/components/roles/roles-view";
import { roles } from "@/lib/roles-data";

export const metadata: Metadata = {
  title: "Role Management",
};

export default function RolesPage() {
  return <RolesView roles={roles} />;
}
