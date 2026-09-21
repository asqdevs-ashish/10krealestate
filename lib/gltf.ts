"use client";

import type { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

/**
 * Loader configuration for every GLB on the site.
 *
 * Compression is set up front so a model exported with either of the two
 * optimisations that GLB actually ships with — Draco and meshopt — loads as-is.
 * Neither decoder is fetched unless the file needs it, so an uncompressed model
 * pays nothing.
 *
 * The Draco decoder is served from `/public/draco`, copied out of three's own
 * distribution, rather than a CDN: the render must not depend on a third party
 * being reachable at runtime, and it keeps the CSP surface closed.
 */
let draco: DRACOLoader | null = null;

export function configureGltfLoader(loader: GLTFLoader): void {
  if (!draco) {
    draco = new DRACOLoader();
    draco.setDecoderPath("/draco/");
  }
  loader.setDRACOLoader(draco);
  loader.setMeshoptDecoder(MeshoptDecoder);
}
