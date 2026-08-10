import { PmShell } from "@/components/pm/pm-shell";

export default function PropertyManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PmShell>{children}</PmShell>;
}
