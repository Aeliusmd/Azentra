"use client";

import { useState } from "react";

import { PmSidebar } from "@/components/pm/pm-sidebar";
import { PmTopbar } from "@/components/pm/pm-topbar";

/**
 * Owns the mobile-drawer state shared between the topbar's menu button and the
 * sidebar, so the route layout itself can stay a server component.
 */
export function PmShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-svh">
      <PmSidebar
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <PmTopbar onOpenMenu={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-7">{children}</main>
      </div>
    </div>
  );
}
