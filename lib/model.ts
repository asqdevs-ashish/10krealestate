"use client";

import { useEffect, useState } from "react";

/**
 * Optional assets — the GLB models, which the site is complete without.
 *
 * `checking` is the honest third state: until the answer is in, neither the
 * model nor the fallback should be swapped in, or the hero would flash from
 * film to 3D on every load.
 */
export type AssetState = "checking" | "available" | "unavailable";

/**
 * Checks whether an optional file is actually being served before anything
 * mounts a canvas or pulls it down. A model that has not been supplied yet
 * then costs one failed check — not a wasted multi-megabyte download, and not
 * an exception thrown inside the renderer. The section simply keeps what it
 * shipped with.
 */
/** One probe per file per page load, shared by every consumer. */
const probes = new Map<string, Promise<boolean>>();

function probe(url: string): Promise<boolean> {
  const cached = probes.get(url);
  if (cached) return cached;
  const request = fetch(url, { method: "HEAD" })
    .then((response) => response.ok)
    .catch(() => false);
  probes.set(url, request);
  return request;
}

export function useAssetState(url: string, enabled = true): AssetState {
  const [state, setState] = useState<AssetState>("checking");

  useEffect(() => {
    if (!enabled) {
      setState("unavailable");
      return;
    }
    let cancelled = false;
    setState("checking");
    void probe(url).then((ok) => {
      if (!cancelled) setState(ok ? "available" : "unavailable");
    });
    return () => {
      cancelled = true;
    };
  }, [url, enabled]);

  return state;
}

/**
 * WebGL support, resolved on the client. Getting a context is the only reliable
 * test — a canvas that cannot have one throws when three builds its renderer,
 * which is far worse than never mounting it.
 */
export function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl")),
    );
  } catch {
    return false;
  }
}
