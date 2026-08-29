import { TenShell } from "@/components/ten/ten-shell";

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TenShell>{children}</TenShell>;
}
