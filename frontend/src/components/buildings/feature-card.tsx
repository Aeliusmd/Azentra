import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

export type FeatureCardProps = {
  title: string;
  description: string;
  value: string;
  caption: string;
  icon: LucideIcon;
  href: string;
  /** Tailwind gradient utilities, e.g. `from-[#f3a751] to-[#e2553d]`. */
  gradient: string;
};

export function FeatureCard({
  title,
  description,
  value,
  caption,
  icon: Icon,
  href,
  gradient,
}: FeatureCardProps) {
  // Lifts and zooms slightly on hover/focus; held still for reduced motion.
  return (
    <Link
      href={href}
      className={`group relative flex min-h-[220px] flex-col overflow-hidden rounded-xl bg-linear-to-br p-6 text-white shadow-sm transition-[transform,box-shadow] duration-200 ease-out will-change-transform hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl focus-visible:-translate-y-1 focus-visible:scale-[1.02] focus-visible:shadow-xl focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2 focus-visible:outline-none motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100 motion-reduce:focus-visible:translate-y-0 motion-reduce:focus-visible:scale-100 ${gradient}`}
    >
      {/* Decorative disc bleeding off the top-right corner */}
      <span
        aria-hidden="true"
        className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-white/10"
      />

      <div className="relative flex flex-1 flex-col">
        <span
          aria-hidden="true"
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20"
        >
          <Icon className="h-5 w-5" />
        </span>

        <h2 className="mt-7 text-[17px] font-semibold">{title}</h2>
        <p className="mt-1 text-[13px] text-white/85">{description}</p>

        <div className="mt-auto flex items-end justify-between gap-4 pt-6">
          <div>
            <p className="text-[26px] leading-none font-bold">{value}</p>
            <p className="mt-1.5 text-xs text-white/75">{caption}</p>
          </div>

          <span
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/25 transition-colors group-hover:bg-white/40"
          >
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
