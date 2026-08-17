import { AccShell } from "@/components/acc/acc-shell";

export default function AccountantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AccShell>{children}</AccShell>;
}
