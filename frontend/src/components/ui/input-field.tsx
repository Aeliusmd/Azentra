import type { LucideIcon } from "lucide-react";
import { FieldError, FieldLabel, controlClasses } from "./field";

type InputFieldProps = Omit<React.ComponentProps<"input">, "className"> & {
  id: string;
  label: string;
  icon?: LucideIcon;
  error?: string;
  /** Rendered inside the control, on the right (e.g. a password eye toggle). */
  trailing?: React.ReactNode;
};

export function InputField({
  id,
  label,
  icon: Icon,
  error,
  trailing,
  required,
  ...props
}: InputFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      <div className="relative">
        {Icon && (
          <Icon
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400"
          />
        )}
        <input
          id={id}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`${controlClasses(!!error)} py-3 ${Icon ? "pl-10" : "pl-3.5"} ${
            trailing ? "pr-11" : "pr-3.5"
          }`}
          {...props}
        />
        {trailing && (
          <div className="absolute top-1/2 right-2 -translate-y-1/2">
            {trailing}
          </div>
        )}
      </div>
      <FieldError id={errorId} message={error} />
    </div>
  );
}
