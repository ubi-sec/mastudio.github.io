import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toISODate } from "@/lib/inquiry-schema";

export const inputClass =
  "h-12 w-full rounded-none border-0 border-b border-input bg-transparent px-0 text-base text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-gold focus:outline-none focus-visible:ring-0";

export function Field({
  label,
  htmlFor,
  error,
  required,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label htmlFor={htmlFor} className="text-[0.68rem] uppercase tracking-[0.25em] text-muted-foreground">
        {label}
        {required && <span className="ml-1 text-gold-ink">*</span>}
      </label>
      {children}
      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export function SelectField({
  id,
  value,
  onChange,
  options,
  placeholder,
  invalid,
}: {
  id: string;
  value?: string;
  onChange: (v: string) => void;
  options: readonly string[];
  placeholder: string;
  invalid?: boolean;
}) {
  return (
    <Select value={value || undefined} onValueChange={onChange}>
      <SelectTrigger
        id={id}
        aria-invalid={invalid}
        className={cn(inputClass, "justify-between shadow-none [&>span]:text-left", !value && "text-muted-foreground/60")}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="z-[70] border-border bg-popover">
        {options.map((o) => (
          <SelectItem key={o} value={o} className="focus:bg-accent focus:text-accent-foreground">
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function DateField({
  id,
  value,
  onChange,
  invalid,
}: {
  id: string;
  value?: string;
  onChange: (v: string) => void;
  invalid?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const selected = value ? parseISO(value) : undefined;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          aria-invalid={invalid}
          className={cn(inputClass, "flex items-center justify-between text-left", !value && "text-muted-foreground/60")}
        >
          {selected ? format(selected, "PPP") : "Select a date"}
          <CalendarIcon className="h-4 w-4 text-gold-ink" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="z-[70] w-auto border-border bg-popover p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(d) => {
            onChange(d ? toISODate(d) : "");
            setOpen(false);
          }}
          disabled={{ before: today }}
          initialFocus
          className="pointer-events-auto p-3"
        />
      </PopoverContent>
    </Popover>
  );
}
