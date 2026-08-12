import { FsShell } from "@/components/fs/fs-shell";

export default function FieldSupervisorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FsShell>{children}</FsShell>;
}
