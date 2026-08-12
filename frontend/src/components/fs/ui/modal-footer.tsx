/** Cancel + submit row shared by every supervisor dialog. */

const SUBMIT_TONE = {
  green: "bg-brand hover:bg-brand-dark",
  navy: "bg-[#2e6cad] hover:bg-[#255a92]",
  amber: "bg-[#e8a33d] hover:bg-[#d18f2d]",
  red: "bg-[#e0554d] hover:bg-[#c9463f]",
} as const;

export type SubmitTone = keyof typeof SUBMIT_TONE;

export function FsModalFooter({
  onCancel,
  label,
  tone = "green",
  disabled,
}: {
  onCancel: () => void;
  label: string;
  tone?: SubmitTone;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-wrap justify-end gap-3 border-t border-hairline px-8 py-5">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-lg border border-hairline px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={disabled}
        className={`rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-colors focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-gray-300 ${SUBMIT_TONE[tone]}`}
      >
        {label}
      </button>
    </div>
  );
}
