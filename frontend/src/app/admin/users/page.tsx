import type { Metadata } from "next";

import { UsersView } from "@/components/users/users-view";
import { users } from "@/lib/users-data";

export const metadata: Metadata = {
  title: "User Management",
};

export default function UsersPage() {
  return <UsersView users={users} />;
}
