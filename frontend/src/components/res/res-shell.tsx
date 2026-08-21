"use client";

import { useState } from "react";

import { ResSidebar } from "@/components/res/res-sidebar";
import { ResTopbar } from "@/components/res/res-topbar";
import { ResToaster } from "@/components/res/ui/toaster";

/**
 * Owns the mobile-drawer state shared between the topbar's menu button and the
 * sidebar, so the route layout itself can stay a server component.
 */
export function ResShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-svh">
      <ResSidebar
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <ResTopbar onOpenMenu={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-7">{children}</main>
      </div>

      <ResToaster />
    </div>
  );
}
