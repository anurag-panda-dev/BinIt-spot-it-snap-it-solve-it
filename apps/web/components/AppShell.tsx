"use client";

import {
  BarChart3,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Map,
  MapPin,
  Menu,
  Route as RouteIcon,
  ScrollText,
  Trash2,
  Truck,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { NotificationBell } from "@/components/notifications";
import { Tooltip } from "@/components/ui";
import { AmbientEcoBackground } from "@/components/landing/AmbientEcoBackground";
import { useAuth, useRequireAuth } from "@/lib/auth";
import { homeForRole } from "@/lib/types";
import { cx } from "@/lib/utils";

type NavItem = { href: string; label: string; short: string; icon: ReactNode; main?: boolean };

const NAV: Record<string, NavItem[]> = {
  CITIZEN: [
    { href: "/citizen/report", label: "Report Waste", short: "Report", icon: <Trash2 className="size-[18px]" />, main: true },
    { href: "/citizen/map", label: "Explore Map", short: "Map", icon: <Map className="size-[18px]" /> },
    { href: "/citizen/my-reports", label: "My Reports", short: "Track", icon: <MapPin className="size-[18px]" /> },
  ],
  WORKER: [
    { href: "/worker/tasks", label: "My Tasks", short: "Tasks", icon: <Truck className="size-[18px]" />, main: true },
    { href: "/citizen/map", label: "Zone Map", short: "Map", icon: <Map className="size-[18px]" /> },
  ],
  OPERATOR: [
    { href: "/operator/dashboard", label: "Dashboard", short: "Home", icon: <LayoutDashboard className="size-[18px]" />, main: true },
    { href: "/operator/queue", label: "Report Queue", short: "Queue", icon: <ClipboardList className="size-[18px]" /> },
    { href: "/operator/map", label: "Ops Map", short: "Map", icon: <Map className="size-[18px]" /> },
    { href: "/operator/routes", label: "Route Planner", short: "Routes", icon: <RouteIcon className="size-[18px]" /> },
  ],
  ADMIN: [
    { href: "/admin/analytics", label: "Analytics", short: "Stats", icon: <BarChart3 className="size-[18px]" />, main: true },
    { href: "/operator/queue", label: "Report Queue", short: "Queue", icon: <ClipboardList className="size-[18px]" /> },
    { href: "/admin/users", label: "Users & Roles", short: "Users", icon: <Users className="size-[18px]" /> },
    { href: "/admin/audit-logs", label: "Audit Logs", short: "Audit", icon: <ScrollText className="size-[18px]" /> },
  ],
} as const;

function Brand({ onClick }: { onClick?: () => void }) {
  return (
    <Link href={onClick ? "/" : "#"} onClick={onClick} className="flex items-center gap-2.5">
      <img
        src="/icons/icon-512.png"
        alt="Binit Logo"
        className="size-9 rounded-xl object-contain shadow-glow-forest"
      />
      <span className="font-display text-lg font-bold tracking-tight text-white">
        binit
        <span className="ml-1 hidden bg-gradient-primary bg-clip-text text-sm font-semibold text-transparent sm:inline">
          · solve it
        </span>
      </span>
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const user = useRequireAuth();
  const { logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;

  const nav = NAV[user.role as keyof typeof NAV] || NAV.CITIZEN;

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 py-5">
        <Brand />
        <button
          className="rounded-lg p-2 text-white/60 transition hover:bg-white/10 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <X className="size-5" />
        </button>
      </div>
      <p className="px-6 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-forest-400/60">
        {user.role.toLowerCase()} workspace
      </p>
      <nav className="flex-1 space-y-1 px-3 py-2">
        {nav.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cx(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-gradient-to-r from-forest-500/25 to-teal-500/5 text-white ring-1 ring-forest-500/30"
                  : "text-forest-100/65 hover:bg-white/5 hover:text-forest-100",
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-gradient-to-b from-forest-400 to-teal-400" />
              )}
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/8 p-4">
        <div className="mb-3 flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-gradient-primary font-bold text-white uppercase shadow-glow-forest">
            {(user.full_name || "U").slice(0, 1)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{user.full_name}</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-forest-400">
              {user.role.replace("_", " ")}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/10"
        >
          <LogOut className="size-4" /> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh bg-transparent">
      <AmbientEcoBackground />

      {/* desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-white/8 lg:bg-surface-900/70 lg:backdrop-blur-xl">
        {sidebar}
      </div>

      {/* mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 animate-fade-in bg-black/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 bg-surface-900 shadow-lift">
            <div className="h-full animate-fade-up">{sidebar}</div>
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        {/* top bar */}
        <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-white/8 bg-surface-950/80 px-4 py-2.5 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <button
              className="rounded-lg p-2 text-white/70 transition hover:bg-white/10 lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
            <div className="lg:hidden">
              <Brand />
            </div>
            <p className="hidden text-[11px] font-medium uppercase tracking-[0.18em] text-forest-100/40 lg:block">
              Binit civic ops · <span className="text-forest-400">{user.role.toLowerCase()} workspace</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Tooltip label="Notifications">
              <NotificationBell />
            </Tooltip>
            <Link
              href={homeForRole(user.role)}
              className="flex items-center gap-2 rounded-full bg-white/5 py-1 pl-1 pr-3 ring-1 ring-white/10 transition hover:bg-white/10"
            >
              <span className="flex size-7 items-center justify-center rounded-full bg-gradient-primary text-xs font-bold text-white uppercase">
                {(user.full_name || "U").slice(0, 1)}
              </span>
              <span className="hidden text-sm font-medium text-white sm:block">{user.full_name.split(" ")[0]}</span>
            </Link>
          </div>
        </header>

        <main className="relative z-[1] mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-10">
          {children}
        </main>
      </div>

      {/* mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-surface-900/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
        <div className="grid grid-cols-4 px-2 py-1.5">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cx(
                  "flex flex-col items-center gap-1 rounded-xl px-1 py-1.5 transition-colors",
                  active ? "text-forest-400" : "text-forest-100/45 hover:text-forest-100",
                )}
              >
                {item.icon}
                <span className="text-[9px] font-semibold uppercase tracking-wide">{item.short}</span>
                {active && <span className="h-0.5 w-5 rounded-full bg-gradient-to-r from-forest-400 to-teal-400" />}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}