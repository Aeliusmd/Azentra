type CheckboxProps = Omit<React.ComponentProps<"input">, "type" | "className"> & {
  id: string;
  label: string;
};

export function Checkbox({ id, label, ...props }: CheckboxProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        id={id}
        type="checkbox"
        className="h-4 w-4 rounded border-gray-300 text-brand accent-brand focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
        {...props}
      />
      <label htmlFor={id} className="text-[13px] text-ink select-none">
        {label}
      </label>
    </div>
  );
}
