import { ResShell } from "@/components/res/res-shell";

export default function ResidentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ResShell>{children}</ResShell>;
}
