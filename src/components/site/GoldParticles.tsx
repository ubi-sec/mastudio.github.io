import { useEffect, useRef } from "react";

/** Lightweight drifting gold dust on a canvas. Pauses when offscreen; off for reduced motion. */
export function GoldParticles({ count = 42, className }: { count?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gold = getComputedStyle(document.documentElement).getPropertyValue("--gold").trim() || "#D6AD62";
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const parts = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.3,
      vy: -(Math.random() * 0.25 + 0.05),
      vx: (Math.random() - 0.5) * 0.15,
      a: Math.random() * 0.6 + 0.15,
      t: Math.random() * Math.PI * 2,
    }));

    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) loop();
    });
    io.observe(canvas);

    const loop = () => {
      if (!visible) return;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = gold;
      for (const p of parts) {
        p.t += 0.02;
        p.x += p.vx + Math.sin(p.t) * 0.1;
        p.y += p.vy;
        if (p.y < -5) {
          p.y = h + 5;
          p.x = Math.random() * w;
        }
        ctx.globalAlpha = p.a * (0.6 + Math.sin(p.t) * 0.4);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [count]);

  return <canvas ref={ref} aria-hidden className={"pointer-events-none absolute inset-0 h-full w-full " + (className ?? "")} />;
}
