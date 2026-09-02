import { SoShell } from "@/components/so/so-shell";

export default function SecurityOfficerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SoShell>{children}</SoShell>;
}
