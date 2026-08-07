import type { Metadata } from "next";

import { PermissionsView } from "@/components/permissions/permissions-view";
import { permissions, rolePermissions } from "@/lib/permissions-data";

export const metadata: Metadata = {
  title: "Permission Management",
};

export default function PermissionsPage() {
  return (
    <PermissionsView
      permissions={permissions}
      initialAssignments={rolePermissions}
    />
  );
}
