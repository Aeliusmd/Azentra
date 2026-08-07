"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

import { NotificationsMenu } from "@/components/dashboard/notifications-menu";
import { useDismiss } from "@/hooks/use-dismiss";
import { currentUser } from "@/lib/dashboard-data";
import { navLabelFor } from "@/lib/nav";

export function Topbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const menuRef = useDismiss<HTMLDivElement>(menuOpen, closeMenu);

  return (
    <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-hairline bg-white px-6">
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-[13px]">
          <li className="font-semibold text-[#1b3a5c]">Admin</li>
          <li aria-hidden="true" className="text-gray-300">
            ›
          </li>
          <li aria-current="page" className="text-muted">
            {navLabelFor(pathname)}
          </li>
        </ol>
      </nav>

      <div className="flex items-center gap-4">
        <NotificationsMenu />

        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="flex items-center gap-2.5 rounded-md p-1 transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
          >
            <span
              aria-hidden="true"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600"
            >
              {currentUser.initials}
            </span>
            <span className="hidden text-left sm:block">
              <span className="block text-[13px] font-semibold text-ink">
                {currentUser.name}
              </span>
              <span className="block text-xs text-muted">
                {currentUser.role}
              </span>
            </span>
            <ChevronDown aria-hidden="true" className="h-4 w-4 text-gray-400" />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 z-30 mt-2 w-44 overflow-hidden rounded-md border border-hairline bg-white py-1 shadow-lg"
            >
              <Link
                role="menuitem"
                href="/admin/settings"
                className="block px-4 py-2 text-[13px] text-gray-600 hover:bg-gray-50 hover:text-ink"
              >
                Settings
              </Link>
              <Link
                role="menuitem"
                href="/login"
                className="block px-4 py-2 text-[13px] text-gray-600 hover:bg-gray-50 hover:text-ink"
              >
                Sign Out
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
