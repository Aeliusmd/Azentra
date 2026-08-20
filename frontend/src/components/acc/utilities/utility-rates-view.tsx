"use client";

import { Droplet, Flame, Zap, type LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { UtilityType } from "@/lib/acc/utility-bills-data";
import { utilityRates } from "@/lib/acc/utility-rates-data";

const ICON: Record<UtilityType, LucideIcon> = {
  Water: Droplet,
  Electricity: Zap,
  Gas: Flame,
};

/** What each utility charges per unit, and what it charged before. */
export function AccUtilityRatesView() {
  const rates = utilityRates();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[28px] leading-tight font-bold text-ink">
          Utility Rates
        </h1>
        <p className="mt-1 text-[14px] text-muted">
          Manage current and historical utility rates
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {rates.map((entry) => {
          const Icon = ICON[entry.type];

          return (
            <li key={entry.type}>
              <Card className="p-5">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef3f9] text-[#5b7f9c]"
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-[15px] font-bold text-ink">
                      {entry.type}
                    </span>
                    <span className="block text-[13px] text-muted">
                      per unit
                    </span>
                  </span>
                </div>

                <p className="mt-4 text-[28px] leading-none font-bold text-ink">
                  LKR {entry.rate}
                </p>
                <p className="mt-2 text-[13px] text-muted">
                  Effective from {entry.effectiveFrom}
                </p>

                <div className="mt-5 border-t border-hairline pt-4">
                  <p className="text-[13px] text-muted">Previous Rate</p>
                  <p className="mt-1 text-[15px] text-ink">
                    LKR {entry.previousRate} (before {entry.effectiveFrom})
                  </p>
                </div>
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
