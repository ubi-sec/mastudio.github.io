import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { photos } from "@/data/photos";
import {
  IMAGE_TYPES,
  MAX_IMAGE_MB,
  isSamplePath,
  resolveMediaUrls,
  uploadFile,
  validateFile,
} from "@/lib/media";
import { cn } from "@/lib/utils";

const SAMPLE_KEYS = Object.keys(photos) as (keyof typeof photos)[];

/**
 * Upload a picture to the studio's media library, or pick one of the bundled samples.
 * Calls back with the stored path (e.g. "gallery/xyz.jpg" or "sample:hero").
 */
export function ImageUpload({
  value,
  onChange,
  folder,
  label = "Image",
  allowSamples = true,
  bucket,
  className,
}: {
  value: string | null | undefined;
  onChange: (path: string | null) => void;
  folder: string;
  label?: string | undefined;
  allowSamples?: boolean | undefined;
  bucket?: string | undefined;
  className?: string | undefined;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [pct, setPct] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let alive = true;
    if (!value) {
      setUrl(null);
      return;
    }
    void resolveMediaUrls([value]).then((m) => {
      if (alive) setUrl(m.get(value) ?? null);
    });
    return () => {
      alive = false;
    };
  }, [value]);

  const pick = async (file: File) => {
    const problem = validateFile(file, IMAGE_TYPES, MAX_IMAGE_MB);
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    setBusy(true);
    setPct(0);
    try {
      const path = await uploadFile(file, folder, bucket ? { bucket, onProgress: setPct } : { onProgress: setPct });
      onChange(path);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <span className="text-[0.68rem] uppercase tracking-[0.25em] text-muted-foreground">{label}</span>

      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-surface">
        {url ? (
          <img src={url} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImagePlus className="h-6 w-6 text-gold-ink" />
            <p className="text-xs">No picture yet</p>
          </div>
        )}
        {busy && (
          <div className="absolute inset-0 grid place-items-center bg-scrim/70 backdrop-blur-sm">
            <div className="w-2/3">
              <div className="h-1 overflow-hidden rounded-full bg-border">
                <div className="h-full bg-gold-gradient transition-[width] duration-200" style={{ width: `${pct}%` }} />
              </div>
              <p className="mt-2 text-center text-xs text-ivory">Uploading {pct}%</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept={IMAGE_TYPES.join(",")}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void pick(f);
            e.target.value = "";
          }}
        />
        <Button type="button" variant="goldOutline" size="pill" onClick={() => inputRef.current?.click()} disabled={busy}>
          {busy ? <Loader2 className="animate-spin" /> : <ImagePlus />}
          {value ? "Replace" : "Upload"}
        </Button>
        {value && (
          <Button type="button" variant="quiet" size="pill" onClick={() => onChange(null)}>
            <Trash2 /> Remove
          </Button>
        )}
        {allowSamples && !isSamplePath(value) && (
          <select
            aria-label="Or use a sample picture"
            value=""
            onChange={(e) => e.target.value && onChange(`sample:${e.target.value}`)}
            className="h-10 rounded-full border border-border bg-transparent px-3 text-xs text-muted-foreground focus:border-gold focus:outline-none"
          >
            <option value="">Use a sample…</option>
            {SAMPLE_KEYS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        )}
      </div>

      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
