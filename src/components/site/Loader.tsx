import { Monogram } from "./Logo";

/** Cinematic intro. Pure CSS timing (see .ma-loader) so it always clears itself. */
export function Loader() {
  return (
    <div
      aria-hidden
      className="ma-loader fixed inset-0 z-[200] flex flex-col items-center justify-center gap-6 bg-ink"
    >
      <Monogram animated className="h-20" />
      <p className="font-serif text-2xl tracking-[0.3em] text-ivory">MA STUDIO</p>
      <div className="h-px w-40 overflow-hidden bg-gold/15">
        <div className="loader-bar h-full w-full bg-gold-gradient" />
      </div>
    </div>
  );
}
