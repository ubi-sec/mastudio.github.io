import { Link, Outlet, createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import {
  CalendarCheck,
  ExternalLink,
  FileText,
  FolderOpen,
  Images,
  Inbox,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  Users,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/site/Logo";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { Button } from "@/components/ui/button";
import { getAdminAccess } from "@/lib/admin-access.functions";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/inquiries", label: "Inquiries", icon: Inbox, exact: false },
  { to: "/admin/bookings", label: "Bookings", icon: CalendarCheck, exact: false },
  { to: "/admin/invoices", label: "Invoices", icon: FileText, exact: false },
  { to: "/admin/customers", label: "Customers", icon: Users, exact: false },
  { to: "/admin/expenses", label: "Expenses", icon: Wallet, exact: false },
  { to: "/admin/gallery", label: "Gallery", icon: Images, exact: false },
  { to: "/admin/portfolio", label: "Portfolio", icon: FolderOpen, exact: false },
  { to: "/admin/packages", label: "Packages", icon: Package, exact: false },
  { to: "/admin/settings", label: "Website settings", icon: Settings, exact: false },
] as const;

export const Route = createFileRoute("/_authenticated/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Studio admin — MA Studio" },
      { name: "description", content: "MA Studio admin area: inquiries, bookings, invoices, gallery and website settings." },
      { name: "robots", content: "noindex" },
    ],
  }),
  beforeLoad: async () => {
    const access = await getAdminAccess();
    if (!access.isAdmin) throw redirect({ to: "/auth" });
  },
  component: AdminShell,
});

function AdminShell() {
  const navigate = useNavigate();
  const { queryClient } = Route.useRouteContext();
  const [signingOut, setSigningOut] = useState(false);

  const signOut = async () => {
    setSigningOut(true);
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    await navigate({ to: "/auth", replace: true });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-[1500px] flex-col lg:flex-row">
        <aside className="shrink-0 border-b border-border bg-surface/60 backdrop-blur-md lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between gap-3 px-5 py-4">
            <Link to="/admin" aria-label="MA Studio admin home">
              <Logo />
            </Link>
            <ThemeToggle className="lg:hidden" />
          </div>
          <nav aria-label="Admin" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:pb-6">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.exact }}
                className={cn(
                  "flex shrink-0 items-center gap-3 rounded-full px-4 py-2.5 text-sm text-foreground/75 transition-colors hover:bg-accent/50 hover:text-gold-ink data-[status=active]:bg-accent/60 data-[status=active]:text-gold-ink",
                  item.exact && "lg:mt-1",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hidden border-t border-border px-5 py-4 lg:block">
            <Button asChild variant="quiet" size="pill" className="w-full justify-start">
              <a href="/" target="_blank" rel="noopener noreferrer">
                <ExternalLink /> View site
              </a>
            </Button>
            <Button variant="quiet" size="pill" className="mt-1 w-full justify-start" onClick={signOut} disabled={signingOut}>
              <LogOut /> Sign out
            </Button>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="flex items-center justify-end gap-2 border-b border-border px-5 py-3 lg:hidden">
            <Button asChild variant="quiet" size="pill">
              <a href="/" target="_blank" rel="noopener noreferrer">
                <ExternalLink /> Site
              </a>
            </Button>
            <Button variant="quiet" size="pill" onClick={signOut} disabled={signingOut}>
              <LogOut /> Out
            </Button>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
