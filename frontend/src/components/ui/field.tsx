/** Shared chrome for every form control on the auth screens. */

export const controlBase =
  "w-full rounded-md border bg-white text-sm text-ink placeholder:text-gray-400 " +
  "outline-none transition-colors focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-50 " +
  // A field the office owns reads as one, rather than looking editable.
  "read-only:text-muted";

export const controlIdle =
  "border-hairline focus:border-brand focus:ring-brand/20";

export const controlInvalid =
  "border-red-300 focus:border-red-400 focus:ring-red-100";

export function controlClasses(hasError?: boolean) {
  return `${controlBase} ${hasError ? controlInvalid : controlIdle}`;
}

export function FieldLabel({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-[13px] font-semibold text-ink"
    >
      {children}
      {required && (
        <span aria-hidden="true" className="ml-0.5 text-red-500">
          *
        </span>
      )}
    </label>
  );
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-xs text-red-600">
      {message}
    </p>
  );
}
