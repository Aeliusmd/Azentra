import { Loader2 } from "lucide-react";

type ButtonProps = React.ComponentProps<"button"> & {
  loading?: boolean;
  /** Full-width (the default, as used by the auth forms). */
  block?: boolean;
};

export function Button({
  loading = false,
  block = true,
  disabled,
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={
        `flex items-center justify-center gap-2 rounded-md bg-brand text-white ${
          block ? "w-full px-4 py-3" : "px-4 py-2.5"
        } ` +
        "text-sm font-semibold transition-colors hover:bg-brand-dark " +
        "focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none " +
        "disabled:cursor-not-allowed disabled:opacity-60 " +
        className
      }
    >
      {loading && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
