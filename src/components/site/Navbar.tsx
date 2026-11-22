import { Link } from "@tanstack/react-router";
import { CalendarDays, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { navItems } from "@/config/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-border bg-background/85 py-3 backdrop-blur-xl"
          : "py-5 light:bg-background/80 light:backdrop-blur-xl",
      )}
    >
      <nav className="container-lux flex items-center justify-between gap-6" aria-label="Main">
        <Link to="/" aria-label="MA Studio home" className="shrink-0">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="link-underline text-sm tracking-wide text-foreground/80 transition-colors hover:text-gold-ink data-[status=active]:text-gold-ink"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button asChild variant="goldOutline" size="pill" className="hidden sm:inline-flex">
            <Link to="/contact" hash="booking">
              Book a Shoot <CalendarDays />
            </Link>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Open menu"
                className="grid h-10 w-10 place-items-center rounded-full border border-border text-foreground lg:hidden"
              >
                <Menu className="h-4 w-4" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-sm border-border bg-background">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="mt-6">
                <Logo />
              </div>
              <ul className="mt-12 flex flex-col gap-1">
                {navItems.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      activeOptions={{ exact: item.to === "/" }}
                      onClick={() => setOpen(false)}
                      className="block border-b border-border py-4 font-serif text-3xl text-foreground transition-colors hover:text-gold-ink data-[status=active]:text-gold-ink"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <Button asChild variant="gold" size="xl" className="mt-10 w-full">
                <Link to="/contact" hash="booking" onClick={() => setOpen(false)}>
                  Book a Shoot <CalendarDays />
                </Link>
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
