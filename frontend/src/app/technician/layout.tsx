import { TechShell } from "@/components/tech/tech-shell";

export default function TechnicianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TechShell>{children}</TechShell>;
}
