"use client";

import { useState } from "react";

import { TenSidebar } from "@/components/ten/ten-sidebar";
import { TenTopbar } from "@/components/ten/ten-topbar";
import { TenToaster } from "@/components/ten/ui/toaster";

/**
 * Owns the mobile-drawer state shared between the topbar's menu button and the
 * sidebar, so the route layout itself can stay a server component.
 */
export function TenShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-svh">
      <TenSidebar
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <TenTopbar onOpenMenu={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-7">{children}</main>
      </div>

      <TenToaster />
    </div>
  );
}
