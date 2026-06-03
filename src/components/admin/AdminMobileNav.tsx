import { useState } from "react";
import { LogOut, Menu, type LucideIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type NavItem = {
  id: string;
  label: string;
  icon: LucideIcon;
};

type Props = {
  navItems: NavItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  getBadge: (id: string) => number | null;
  onLogout: () => void;
};

export function AdminMobileNav({
  navItems,
  activeTab,
  onTabChange,
  getBadge,
  onLogout,
}: Props) {
  const [open, setOpen] = useState(false);
  const activeLabel = navItems.find((i) => i.id === activeTab)?.label ?? "Menu";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="lg:hidden flex items-center gap-2 h-10 px-3 rounded-lg border border-warm-200 bg-white hover:bg-warm-100 text-ink-900 transition min-w-0 max-w-[min(100%,12rem)]"
          aria-label="Open admin menu"
        >
          <Menu className="w-4 h-4 shrink-0" />
          <span className="text-sm font-semibold truncate">{activeLabel}</span>
        </button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[min(100vw,18rem)] bg-ink-900 border-ink-800 p-0 text-white flex flex-col h-full"
      >
        <SheetHeader className="px-5 py-5 border-b border-white/10 text-left">
          <SheetTitle className="font-display text-white text-left">
            Admin CRM
          </SheetTitle>
          <p className="text-[10px] uppercase tracking-widest text-white/50 text-left">
            CompleteMyProject
          </p>
        </SheetHeader>
        <nav className="px-3 py-4 space-y-1 overflow-y-auto flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            const badge = getBadge(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onTabChange(item.id);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition ${
                  active
                    ? "bg-accent text-ink-900"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
                {badge != null && (
                  <span
                    className={`text-[10px] font-bold min-w-[1.25rem] text-center px-1.5 py-0.5 rounded-full tabular-nums ${
                      active ? "bg-ink-900/20 text-ink-900" : "bg-white/15 text-white"
                    }`}
                  >
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-white/10 mt-auto">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
