import { Link } from "@tanstack/react-router";
import { Home, Workflow, Boxes, FolderOpen, Settings, Menu } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/workflow", label: "Workflows", icon: Workflow },
  { to: "/models", label: "Models", icon: Boxes },
  { to: "/projects", label: "Projects", icon: FolderOpen },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          activeOptions={{ exact: to === "/" }}
          className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          activeProps={{
            className: "bg-primary-soft text-accent-foreground hover:bg-primary-soft",
          }}
        >
          <Icon className="size-[18px]" strokeWidth={1.8} />
          {label}
        </Link>
      ))}
    </nav>
  );
}

function SidebarInner({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col justify-between px-4 py-6">
      <div>
        <Link to="/" onClick={onNavigate} className="mb-8 flex items-center gap-3 px-1">
          <span className="flex size-9 items-center justify-center rounded-xl bg-foreground text-sm font-bold tracking-tight text-background">
            CD
          </span>
          <span className="text-sm font-semibold tracking-tight">Creative Director</span>
        </Link>
        <NavList onNavigate={onNavigate} />
      </div>
      <div className="space-y-3">
        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
          <Settings className="size-[18px]" strokeWidth={1.8} />
          Settings
        </button>
        <p className="px-3 text-[11px] leading-relaxed text-muted-foreground">
          Independent prototype. Not affiliated with any model provider.
        </p>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] border-r border-border bg-sidebar lg:block">
        <SidebarInner />
      </aside>

      <div className="lg:pl-[248px]">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/85 px-4 backdrop-blur-md sm:px-8">
          <div className="flex items-center gap-3">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                aria-label="Open navigation"
                className="flex size-9 items-center justify-center rounded-xl border border-border transition-colors hover:bg-secondary lg:hidden"
              >
                <Menu className="size-[18px]" strokeWidth={1.8} />
              </SheetTrigger>
              <SheetContent side="left" className="w-[268px] bg-sidebar p-0">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <SidebarInner onNavigate={() => setOpen(false)} />
              </SheetContent>
            </Sheet>
            <span className="flex size-8 items-center justify-center rounded-lg bg-foreground text-[11px] font-bold text-background lg:hidden">
              CD
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              <span className="text-xs font-medium">Demo Workspace</span>
            </div>
            <div className="flex size-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
              RS
            </div>
          </div>
        </header>

        <main className={cn("px-4 pb-24 pt-8 sm:px-8")}>{children}</main>
      </div>
    </div>
  );
}
