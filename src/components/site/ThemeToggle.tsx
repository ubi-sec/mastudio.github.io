import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export const THEME_KEY = "ma-theme";

/** Inline script for <head>: applies the saved theme before paint. */
export const themeInitScript = `try{if(localStorage.getItem("${THEME_KEY}")==="light")document.documentElement.classList.add("light")}catch(e){}`;

export function ThemeToggle({ className }: { className?: string }) {
  const [light, setLight] = useState(false);

  useEffect(() => {
    setLight(document.documentElement.classList.contains("light"));
  }, []);

  const toggle = () => {
    const next = !light;
    setLight(next);
    document.documentElement.classList.toggle("light", next);
    try {
      localStorage.setItem(THEME_KEY, next ? "light" : "dark");
    } catch {
      /* storage unavailable */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={light ? "Switch to dark mode" : "Switch to light mode"}
      className={
        "grid h-10 w-10 place-items-center rounded-full border border-border text-foreground/80 transition-all duration-500 hover:border-gold hover:text-gold-ink " +
        (className ?? "")
      }
    >
      {light ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </button>
  );
}
