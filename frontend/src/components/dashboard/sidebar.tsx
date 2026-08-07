"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";

import { Logo } from "@/components/ui/logo";
import { navItems } from "@/lib/nav";

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // z-30 keeps the rail — and the toggle that straddles its edge — above the
  // topbar's z-20 white background.
  return (
    <aside
      className={`sticky top-0 z-30 hidden h-svh shrink-0 flex-col border-r border-hairline bg-white transition-[width] duration-200 md:flex ${
        collapsed ? "w-[76px]" : "w-[220px]"
      }`}
    >
      {/* Anchored to the aside, not the header, so no border box clips it. */}
      <button
        type="button"
        onClick={() => setCollapsed((value) => !value)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!collapsed}
        className="absolute top-[62px] -right-3.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#1b3a5c] text-white shadow-sm transition-colors hover:bg-[#152e49] focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-none"
      >
        {collapsed ? (
          <ChevronRight aria-hidden="true" className="h-4 w-4" />
        ) : (
          <ChevronLeft aria-hidden="true" className="h-4 w-4" />
        )}
      </button>

      <div className="flex h-[76px] items-center border-b border-hairline px-4">
        <Link href="/admin/dashboard" aria-label="Azentra dashboard">
          <Logo
            markOnly={collapsed}
            className={collapsed ? "h-auto w-[34px]" : "h-auto w-[116px]"}
          />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-0.5">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active =
              pathname === href || pathname.startsWith(`${href}/`);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  title={collapsed ? label : undefined}
                  className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-[13px] transition-colors ${
                    active
                      ? "bg-[#eef3f9] font-semibold text-[#1b3a5c]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-ink"
                  } ${collapsed ? "justify-center px-0" : ""}`}
                >
                  <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                  {!collapsed && <span className="truncate">{label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-hairline p-3">
        <Link
          href="/login"
          title={collapsed ? "Sign Out" : undefined}
          className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-[13px] text-gray-600 transition-colors hover:bg-gray-50 hover:text-ink ${
            collapsed ? "justify-center px-0" : ""
          }`}
        >
          <LogOut aria-hidden="true" className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </Link>
      </div>
    </aside>
  );
}
