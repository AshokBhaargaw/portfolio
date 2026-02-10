"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Briefcase,
  Share2,
  User,
  MessageSquare,
  FileSliders,
} from "lucide-react";
import { BiLeftArrow } from "react-icons/bi";

/* --------------- ICON REGISTRY (KEY PART – DO NOT CHANGE) --------------- */

// In your OptionBar file (Sidebar + MobileTabBar)
const ICONS = {
  LayoutDashboard: LayoutDashboard,
  FolderKanban: FolderKanban,
  Briefcase: Briefcase,
  Share2: Share2,
  User: User,
  MessageSquare: MessageSquare,
  FileSliders: FileSliders,
} as const;

/* --------------- TYPES --------------- */

export type NavItem = {
  href: string;
  label: string;
  icon: keyof typeof ICONS;
};

type Props = {
  navItems: NavItem[];
};

/* --------------- DESKTOP SIDEBAR --------------- */

export function Sidebar({ navItems }: Props) {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-slate-900/90 border-r border-slate-800">
      <div className="w-full px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-slate-400 uppercase mb-6"
        >
          <BiLeftArrow /> Go Home
        </Link>

        <h1 className="text-lg font-bold text-purple-400 mb-6">Admin Panel</h1>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = ICONS[item.icon];
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition
                  ${
                    active
                      ? "bg-purple-600/20 text-purple-400"
                      : "text-slate-400 hover:bg-purple-700/20 hover:text-white"
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

/* --------------- MOBILE TAB BAR --------------- */
export function MobileTabBar({ navItems }: Props) {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-900 border-t border-slate-800">
      <div className="flex h-full">
        {navItems.map((item) => {
          const Icon = ICONS[item.icon];
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 flex-1 transition
                ${
                  active
                    ? "text-purple-400"
                    : "text-slate-400 hover:text-purple-400"
                }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
