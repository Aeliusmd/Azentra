"use client";

import { useState } from "react";

import { FsSidebar } from "@/components/fs/fs-sidebar";
import { FsTopbar } from "@/components/fs/fs-topbar";
import { FsToaster } from "@/components/fs/ui/toaster";

/**
 * Owns the mobile-drawer state shared between the topbar's menu button and the
 * sidebar, so the route layout itself can stay a server component.
 */
export function FsShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-svh">
      <FsSidebar
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <FsTopbar onOpenMenu={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-7">{children}</main>
      </div>

      <FsToaster />
    </div>
  );
}
