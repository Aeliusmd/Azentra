"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, LogOut, X } from "lucide-react";

import { Logo } from "@/components/ui/logo";
import { RES_BASE, resNavItems, type ResNavItem } from "@/lib/res/nav";

const ROW =
  "relative flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-[14px] transition-colors";
const ROW_IDLE = "text-gray-600 hover:bg-gray-50 hover:text-ink";
const ROW_ACTIVE = "bg-[#eef3f9] font-semibold text-[#1b3a5c]";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavRow({
  item,
  active,
  collapsed,
  onNavigate,
}: {
  item: ResNavItem;
  active: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const { label, href, icon: Icon } = item;

  return (
    <li>
      <Link
        href={href}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        title={collapsed ? label : undefined}
        className={`${ROW} ${active ? ROW_ACTIVE : ROW_IDLE} ${
          collapsed ? "justify-center px-0" : ""
        }`}
      >
        {/* Accent bar on the rail's edge — findable in peripheral vision. */}
        {active && (
          <span
            aria-hidden="true"
            className="absolute top-1 bottom-1 -left-3 w-[3px] rounded-r bg-[#1b3a5c]"
          />
        )}
        <Icon aria-hidden="true" className="h-[18px] w-[18px] shrink-0" />
        {!collapsed && <span className="truncate">{label}</span>}
      </Link>
    </li>
  );
}

/** The rail's scrolling body — shared by the desktop aside and mobile drawer. */
function NavBody({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 overflow-y-auto p-3">
      <ul className="space-y-0.5">
        {resNavItems.map((item) => (
          <NavRow
            key={item.href}
            item={item}
            active={isActive(pathname, item.href)}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </ul>
    </nav>
  );
}

function SignOut({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="border-t border-hairline p-3">
      <Link
        href="/login"
        title={collapsed ? "Sign Out" : undefined}
        className={`${ROW} ${ROW_IDLE} ${collapsed ? "justify-center px-0" : ""}`}
      >
        <LogOut aria-hidden="true" className="h-[18px] w-[18px] shrink-0" />
        {!collapsed && <span>Sign Out</span>}
      </Link>
    </div>
  );
}

export function ResSidebar({
  mobileOpen,
  onCloseMobile,
}: {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Desktop rail — z-30 keeps it, and the toggle straddling its edge,
          above the topbar's z-20 background. */}
      <aside
        className={`sticky top-0 z-30 hidden h-svh shrink-0 flex-col border-r border-hairline bg-white transition-[width] duration-200 md:flex ${
          collapsed ? "w-[76px]" : "w-[244px]"
        }`}
      >
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
          <Link href={`${RES_BASE}/dashboard`} aria-label="Azentra home">
            <Logo
              markOnly={collapsed}
              className={collapsed ? "h-auto w-[34px]" : "h-auto w-[116px]"}
            />
          </Link>
        </div>

        <NavBody collapsed={collapsed} />
        <SignOut collapsed={collapsed} />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            onClick={onCloseMobile}
            className="absolute inset-0 bg-gray-900/50"
          />
          <aside className="absolute inset-y-0 left-0 flex w-[260px] flex-col bg-white shadow-xl">
            <div className="flex h-[76px] items-center justify-between border-b border-hairline px-4">
              <Link
                href={`${RES_BASE}/dashboard`}
                onClick={onCloseMobile}
                aria-label="Azentra home"
              >
                <Logo className="h-auto w-[116px]" />
              </Link>
              <button
                type="button"
                onClick={onCloseMobile}
                className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-ink focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
              >
                <X aria-hidden="true" className="h-5 w-5" />
                <span className="sr-only">Close menu</span>
              </button>
            </div>

            <NavBody collapsed={false} onNavigate={onCloseMobile} />
            <SignOut collapsed={false} />
          </aside>
        </div>
      )}
    </>
  );
}
