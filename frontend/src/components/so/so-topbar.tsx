"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronDown, LogOut, Menu, UserRound } from "lucide-react";

import { SoNotificationsMenu } from "@/components/so/so-notifications-menu";
import { useDismiss } from "@/hooks/use-dismiss";
import { securityOfficer, soFullName, soInitials } from "@/lib/so/officer";
import { SO_BASE, soNavLabelFor } from "@/lib/so/nav";

const MENU_ITEM =
  "flex items-center gap-3 px-5 py-3 text-[15px] transition-colors hover:bg-gray-50";

export function SoTopbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const menuRef = useDismiss<HTMLDivElement>(menuOpen, closeMenu);

  return (
    <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between gap-4 border-b border-hairline bg-white px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Open navigation"
          className="rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-50 hover:text-ink focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none md:hidden"
        >
          <Menu aria-hidden="true" className="h-5 w-5" />
        </button>

        <nav aria-label="Breadcrumb" className="min-w-0">
          <ol className="flex items-center gap-2 text-[13px]">
            <li className="font-semibold text-[#1b3a5c]">Security Officer</li>
            <li aria-hidden="true" className="text-gray-300">
              ›
            </li>
            <li aria-current="page" className="truncate text-muted">
              {soNavLabelFor(pathname)}
            </li>
          </ol>
        </nav>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <SoNotificationsMenu />

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
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e8eef5] text-[15px] font-semibold text-[#1b3a5c]"
            >
              {soInitials().charAt(0)}
            </span>
            <span className="hidden text-left sm:block">
              <span className="block text-[15px] font-bold text-ink">
                {soFullName()}
              </span>
              <span className="block text-[13px] text-muted">
                Security Officer
              </span>
            </span>
            <ChevronDown aria-hidden="true" className="h-4 w-4 text-gray-400" />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 z-30 mt-2 w-[250px] overflow-hidden rounded-xl border border-hairline bg-white shadow-lg"
            >
              <div className="border-b border-hairline px-5 py-4">
                <p className="text-[15px] font-bold text-ink">{soFullName()}</p>
                <p className="mt-0.5 truncate text-[13px] text-muted">
                  {securityOfficer.email}
                </p>
              </div>

              <div className="border-b border-hairline py-1">
                <Link
                  role="menuitem"
                  href={`${SO_BASE}/profile`}
                  onClick={closeMenu}
                  className={`${MENU_ITEM} text-gray-700`}
                >
                  <UserRound
                    aria-hidden="true"
                    className="h-[18px] w-[18px] text-gray-500"
                  />
                  Profile
                </Link>
                <Link
                  role="menuitem"
                  href={`${SO_BASE}/notifications`}
                  onClick={closeMenu}
                  className={`${MENU_ITEM} text-gray-700`}
                >
                  <Bell
                    aria-hidden="true"
                    className="h-[18px] w-[18px] text-gray-500"
                  />
                  Notifications
                </Link>
              </div>

              <div className="py-1">
                <Link
                  role="menuitem"
                  href="/login"
                  className={`${MENU_ITEM} text-rose-600`}
                >
                  <LogOut aria-hidden="true" className="h-[18px] w-[18px]" />
                  Sign Out
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
