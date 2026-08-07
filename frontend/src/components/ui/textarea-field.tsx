import type { LucideIcon } from "lucide-react";
import { FieldError, FieldLabel, controlClasses } from "./field";

type TextareaFieldProps = Omit<
  React.ComponentProps<"textarea">,
  "className"
> & {
  id: string;
  label: string;
  icon?: LucideIcon;
  error?: string;
};

export function TextareaField({
  id,
  label,
  icon: Icon,
  error,
  required,
  rows = 2,
  ...props
}: TextareaFieldProps) {
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
            className="pointer-events-none absolute top-3.5 left-3.5 h-4 w-4 text-gray-400"
          />
        )}
        <textarea
          id={id}
          rows={rows}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`${controlClasses(!!error)} resize-none py-3 pr-3.5 ${
            Icon ? "pl-10" : "pl-3.5"
          }`}
          {...props}
        />
      </div>
      <FieldError id={errorId} message={error} />
    </div>
  );
}
