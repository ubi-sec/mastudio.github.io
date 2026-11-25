import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalendarCheck, FileText, Inbox, Users } from "lucide-react";
import { AdminPage, EmptyState, Panel, StatCard, StatusPill } from "@/components/admin/ui";
import { getAdminDashboard } from "@/lib/admin-dashboard.functions";
import { formatDate, formatPKR } from "@/lib/format";

export const dashboardQuery = queryOptions({
  queryKey: ["admin", "dashboard"],
  queryFn: () => getAdminDashboard(),
});

export const Route = createFileRoute("/_authenticated/admin/")({
  ssr: false,
  loader: ({ context }) => context.queryClient.ensureQueryData(dashboardQuery),
  component: DashboardPage,
});

function DashboardPage() {
  const { data: d } = useSuspenseQuery(dashboardQuery);

  return (
    <AdminPage
      title="Dashboard"
      subtitle="A quick look at what's coming in, what's booked and what's still owed."
      actions={
        <>
          <ButtonLink to="/admin/inquiries">Open inquiries</ButtonLink>
          <ButtonLink to="/admin/invoices">New invoice</ButtonLink>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="New inquiries" value={String(d.inquiriesNew)} hint={`${d.inquiriesTotal} in total`} icon={Inbox} />
        <StatCard label="Bookings ahead" value={String(d.bookingsUpcoming)} hint={`${d.bookingsThisMonth} this month`} icon={CalendarCheck} />
        <StatCard label="Still owed" value={formatPKR(d.outstanding)} hint={`${d.invoicesUnpaid} unpaid invoices`} icon={FileText} />
        <StatCard label="Collected this month" value={formatPKR(d.collectedThisMonth)} hint={`${formatPKR(d.collectedTotal)} all time`} icon={Users} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Panel title="Collected, last 6 months">
          {d.revenueByMonth.every((m) => m.revenue === 0) ? (
            <EmptyState title="No payments recorded yet" hint="Record a payment on an invoice and it shows up here." />
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={d.revenueByMonth} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} width={70} tickFormatter={(v: number) => formatPKR(v)} />
                  <Tooltip
                    cursor={{ fill: "var(--accent)", opacity: 0.35 }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const p = payload[0];
                      return (
                        <div className="rounded-lg border border-hairline bg-surface-raised px-3 py-2 text-xs text-foreground shadow-glow">
                          <p className="text-muted-foreground">{String(p.payload?.month ?? "")}</p>
                          <p className="mt-1 font-serif text-lg text-gold-ink">{formatPKR(Number(p.value ?? 0))}</p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="revenue" fill="var(--gold)" radius={[4, 4, 0, 0]} maxBarSize={54} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Panel>

        <Panel title="Latest inquiries" actions={<Link to="/admin/inquiries" className="text-xs uppercase tracking-[0.18em] text-gold-ink hover:text-gold-light">All</Link>}>
          {d.recentInquiries.length ? (
            <ul className="divide-y divide-border">
              {d.recentInquiries.map((i) => (
                <li key={i.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-foreground">{i.customerName}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {i.packageName} · {i.eventType} · {formatDate(i.createdAt)}
                    </p>
                  </div>
                  <StatusPill value={i.status} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No inquiries yet" hint="Package inquiries from the website land here." />
          )}
        </Panel>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Customers" value={String(d.customers)} />
        <StatCard label="Open booking requests" value={String(d.bookingRequestsOpen)} />
        <StatCard label="Gallery pictures live" value={String(d.photosPublished)} />
        <StatCard label="Portfolio projects live" value={String(d.projectsPublished)} />
      </div>

      <Panel title="Recent invoices" className="mt-6" actions={<Link to="/admin/invoices" className="text-xs uppercase tracking-[0.18em] text-gold-ink hover:text-gold-light">All</Link>}>
        {d.recentInvoices.length ? (
          <ul className="divide-y divide-border">
            {d.recentInvoices.map((i) => (
              <li key={i.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm text-foreground">
                    <span className="text-gold-ink">{i.invoiceNumber || "—"}</span> · {i.customerName}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatDate(i.invoiceDate)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-serif text-lg text-foreground">{formatPKR(i.total)}</p>
                  <StatusPill value={i.paymentStatus} />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="No invoices yet" hint="Create one from a booking or straight from the Invoices page." />
        )}
      </Panel>
    </AdminPage>
  );
}

function ButtonLink({ to, children }: { to: "/admin/inquiries" | "/admin/invoices"; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="inline-flex h-10 items-center rounded-full bg-gold-gradient px-5 text-xs font-semibold uppercase tracking-[0.18em] text-ink shadow-glow transition-transform hover:-translate-y-0.5"
    >
      {children}
    </Link>
  );
}
