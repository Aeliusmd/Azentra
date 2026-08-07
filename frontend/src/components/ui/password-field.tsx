"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { InputField } from "./input-field";

type PasswordFieldProps = Omit<
  React.ComponentProps<typeof InputField>,
  "icon" | "trailing" | "type"
>;

export function PasswordField({ label, ...props }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const ToggleIcon = visible ? EyeOff : Eye;

  return (
    <InputField
      {...props}
      label={label}
      type={visible ? "text" : "password"}
      icon={Lock}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={`${visible ? "Hide" : "Show"} ${label.toLowerCase()}`}
          aria-pressed={visible}
          className="rounded p-1.5 text-gray-400 transition-colors hover:text-gray-600 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
        >
          <ToggleIcon aria-hidden="true" className="h-4 w-4" />
        </button>
      }
    />
  );
}
