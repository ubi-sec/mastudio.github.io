import { supabase } from "@/integrations/supabase/client";
import { photos } from "@/data/photos";

export const MEDIA_BUCKET = "media";
export const RECEIPTS_BUCKET = "receipts";

const SIGNED_TTL = 60 * 60 * 24 * 7;

export function isSamplePath(path: string | null | undefined): path is string {
  return !!path && path.startsWith("sample:");
}

export function samplePhoto(path: string): string | undefined {
  const key = path.slice("sample:".length) as keyof typeof photos;
  return photos[key];
}

/** Resolve stored image paths (bundled samples or files in storage) to displayable URLs. */
export async function resolveMediaUrls(paths: (string | null | undefined)[], bucket = MEDIA_BUCKET) {
  const map = new Map<string, string>();
  const remote = new Set<string>();
  for (const p of paths) {
    if (!p) continue;
    if (isSamplePath(p)) {
      const src = samplePhoto(p);
      if (src) map.set(p, src);
    } else remote.add(p);
  }
  if (remote.size) {
    const { data, error } = await supabase.storage.from(bucket).createSignedUrls([...remote], SIGNED_TTL);
    if (error) console.error("Could not load images", error.message);
    for (const d of data ?? []) if (d.path && d.signedUrl) map.set(d.path, d.signedUrl);
  }
  return map;
}

export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
export const RECEIPT_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
export const MAX_IMAGE_MB = 15;
export const MAX_RECEIPT_MB = 10;

export function validateFile(file: File, types: string[], maxMb: number): string | null {
  if (!types.includes(file.type)) return `${file.name}: this file type isn't supported.`;
  if (file.size > maxMb * 1024 * 1024) return `${file.name}: larger than ${maxMb} MB.`;
  return null;
}

/** Upload with real byte progress (XHR) to a storage bucket. Returns the stored path. */
export async function uploadFile(
  file: File,
  folder: string,
  opts: { bucket?: string; onProgress?: (pct: number) => void } = {},
): Promise<string> {
  const bucket = opts.bucket ?? MEDIA_BUCKET;
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Your session has expired. Please sign in again.");
  const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 5) || "bin";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const base = String(import.meta.env.VITE_SUPABASE_URL).replace(/\/+$/, "");
  const key = String(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${base}/storage/v1/object/${bucket}/${path}`);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.setRequestHeader("apikey", key);
    xhr.setRequestHeader("x-upsert", "false");
    xhr.setRequestHeader("cache-control", "max-age=31536000");
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) opts.onProgress?.(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else {
        let msg = "Upload failed";
        try {
          msg = JSON.parse(xhr.responseText).message ?? msg;
        } catch {
          /* keep default */
        }
        reject(new Error(msg));
      }
    };
    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(file);
  });
  opts.onProgress?.(100);
  return path;
}

export async function removeFiles(paths: (string | null | undefined)[], bucket = MEDIA_BUCKET) {
  const real = paths.filter((p): p is string => !!p && !isSamplePath(p));
  if (real.length) await supabase.storage.from(bucket).remove(real);
}

/** Read image dimensions to pick a masonry shape. */
export function detectShape(file: File): Promise<"tall" | "wide" | "square"> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const r = img.naturalWidth / img.naturalHeight;
      URL.revokeObjectURL(url);
      resolve(r > 1.15 ? "wide" : r < 0.87 ? "tall" : "square");
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve("square");
    };
    img.src = url;
  });
}
