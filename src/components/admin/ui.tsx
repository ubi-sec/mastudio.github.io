import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { inputClass } from "@/components/inquiry/fields";
import { cn } from "@/lib/utils";
import { Inbox, Loader2, Search, type LucideIcon } from "lucide-react";
import { type ReactNode } from "react";

/* ---------------- Page scaffolding ---------------- */

export function AdminPage({
  title,
  subtitle,
  actions,
  children,
  className,
}: {
  title: string;
  subtitle?: string | undefined;
  actions?: ReactNode | undefined;
  children: ReactNode;
  className?: string | undefined;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-5 py-8 md:px-8 md:py-10", className)}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl font-medium text-foreground md:text-5xl">{title}</h1>
          {subtitle && <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}

export function Panel({
  title,
  actions,
  children,
  className,
  pad = true,
}: {
  title?: string | undefined;
  actions?: ReactNode | undefined;
  children: ReactNode;
  className?: string | undefined;
  pad?: boolean | undefined;
}) {
  return (
    <section className={cn("rounded-xl border border-border bg-card/70 backdrop-blur-sm", className)}>
      {(title || actions) && (
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
          {title && <h2 className="eyebrow">{title}</h2>}
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className={cn(pad && "p-5")}>{children}</div>
    </section>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint?: string | undefined;
  icon?: LucideIcon | undefined;
}) {
  return (
    <div className="rounded-xl border border-border bg-card/70 p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground">{label}</p>
        {Icon && <Icon className="h-4 w-4 shrink-0 text-gold-ink" />}
      </div>
      <p className="mt-3 font-serif text-3xl font-medium text-foreground">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function EmptyState({
  title,
  hint,
  action,
  icon: Icon = Inbox,
}: {
  title: string;
  hint?: string | undefined;
  action?: ReactNode | undefined;
  icon?: LucideIcon | undefined;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full border border-hairline">
        <Icon className="h-5 w-5 text-gold-ink" />
      </span>
      <p className="font-serif text-2xl text-foreground">{title}</p>
      {hint && <p className="max-w-sm text-sm text-muted-foreground">{hint}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function Busy({ label = "Loading…" }: { label?: string | undefined }) {
  return (
    <div className="flex items-center justify-center gap-3 py-14 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin text-gold-ink" /> {label}
    </div>
  );
}

/* ---------------- Table ---------------- */

export interface Column<T> {
  header: string;
  cell: (row: T) => ReactNode;
  className?: string | undefined;
  headerClassName?: string | undefined;
}

export function DataTable<T>({
  rows,
  columns,
  rowKey,
  empty,
  caption,
  onRowClick,
}: {
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
  empty?: ReactNode | undefined;
  caption?: string | undefined;
  onRowClick?: ((row: T) => void) | undefined;
}) {
  if (!rows.length) return <>{empty ?? <EmptyState title="Nothing here yet" />}</>;
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[720px] text-left text-sm">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr className="border-b border-border bg-surface">
            {columns.map((c, i) => (
              <th
                key={c.header + i}
                scope="col"
                className={cn("px-4 py-3 text-[0.65rem] font-normal uppercase tracking-[0.2em] text-muted-foreground", c.headerClassName)}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={rowKey(r)}
              onClick={onRowClick ? () => onRowClick(r) : undefined}
              className={cn(
                "border-b border-border last:border-0 transition-colors hover:bg-accent/40",
                onRowClick && "cursor-pointer",
              )}
            >
              {columns.map((c, i) => (
                <td key={c.header + i} className={cn("px-4 py-3 align-middle text-foreground/85", c.className)}>
                  {c.cell(r)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------- Small controls ---------------- */

export function SearchInput({
  value,
  onChange,
  placeholder = "Search",
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string | undefined;
  className?: string | undefined;
}) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className={inputClass + " h-11 pl-10 text-sm"}
      />
    </div>
  );
}

export function Toolbar({ children, className }: { children: ReactNode; className?: string | undefined }) {
  return <div className={cn("mb-5 flex flex-wrap items-center gap-3", className)}>{children}</div>;
}

const POSITIVE = new Set(["confirmed", "paid", "active", "published", "completed", "approved", "new"]);

export function StatusPill({ value }: { value: string }) {
  const positive = POSITIVE.has(value.toLowerCase());
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full border px-3 py-1 text-[0.6rem] uppercase tracking-[0.18em]",
        positive ? "border-hairline bg-accent/40 text-gold-ink" : "border-border text-muted-foreground",
      )}
    >
      {value}
    </span>
  );
}

/* ---------------- Confirm ---------------- */

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  message,
  confirmLabel = "Delete",
  busy = false,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message?: string | undefined;
  confirmLabel?: string | undefined;
  busy?: boolean | undefined;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-hairline bg-surface-raised text-foreground">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-serif text-2xl">{title}</AlertDialogTitle>
          {message && <AlertDialogDescription className="text-muted-foreground">{message}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3 sm:gap-3">
          <AlertDialogCancel className="border-border bg-transparent text-foreground hover:bg-accent hover:text-gold-ink">
            Keep it
          </AlertDialogCancel>
          <AlertDialogAction asChild onClick={onConfirm}>
            <Button variant="gold" disabled={busy}>
              {busy && <Loader2 className="animate-spin" />}
              {confirmLabel}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
