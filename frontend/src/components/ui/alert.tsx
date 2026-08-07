import { AlertCircle } from "lucide-react";

export function Alert({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-[13px] text-red-700"
    >
      <AlertCircle aria-hidden="true" className="mt-px h-4 w-4 shrink-0" />
      <span>{children}</span>
    </div>
  );
}
