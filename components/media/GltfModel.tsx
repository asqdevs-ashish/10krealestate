"use client";

import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { configureGltfLoader } from "@/lib/gltf";

/**
 * A supplied GLB, fitted into a volume the camera can be framed against.
 *
 * Models arrive however they were exported — arbitrary units, arbitrary origin,
 * rarely centred. Rather than ask for numbers that would have to be re-entered
 * on the next export, the file is measured once (`Box3`) and scaled so the
 * *smallest* ratio in `fit` wins, then re-centred in x and z. `anchor` decides
 * whether the base sits on y = 0 (it stands on the ground plane, as the drawn
 * massing does) or the model is centred on the origin (it hangs in a frame).
 *
 * The measurement counts **solids only** — meshes with a real extent on all three
 * axes. A plane has no thickness, so it can never say how tall a model is, and a
 * stray one does real damage: a supplied export carried two leftover plates
 * sitting three units above a subject that was 0.37 units tall, and framing the
 * union of everything made the subject a speck in the middle of the frame. If a
 * file is nothing but planes, they are used.
 *
 * `onMeasure` reports the fitted size, which lets a scene put its camera in
 * proportion to whatever was supplied (see ArchitectureCanvas).
 *
 * `tint` grades every material in the file towards a house colour. A supplied
 * model arrives with whatever palette it was authored in — often a neutral grey
 * or a flat clay render — so a small multiply towards the section's colour is
 * what makes it belong to the page rather than sit on top of it. It multiplies,
 * so texture detail survives and the model keeps its own light and shade.
 *
 * `quality` is the other half of that: on a phone the two settings that cost the
 * most — a transmission pass, which re-renders the scene into an offscreen
 * buffer every frame — are swapped for a cheap approximation of the same look.
 *
 * `progress` scrubs the model's first animation with a scroll position — see the
 * effect below for why that beats playing it on a clock.
 *
 * `fallback` is used twice: as the Suspense fallback while the file loads, and
 * as the error boundary's output if it fails. A missing or broken model
 * therefore leaves the scene exactly as it was.
 */

export type Fit = { width?: number; height?: number; depth?: number };
export type ModelSize = { width: number; height: number; depth: number };
export type ModelQuality = "high" | "low";

/** A mesh thinner than this fraction of the model is a plane, not a solid. */
const SOLID_ENOUGH = 0.001;

/**
 * Grade and simplify every material in a hierarchy, on private copies.
 *
 * The copies matter: `useLoader` hands the same asset to every consumer, and
 * `scene.clone()` shares materials between clones. Tinting in place would grade
 * the file twice for the second canvas, and would leak into anything else
 * rendering the same model. So each distinct material is cloned once, and the
 * clone is what the meshes point at.
 */
function prepareMaterials(
  root: THREE.Object3D,
  { tint, tintAmount, quality }: Grade,
) {
  const graded = new Map<THREE.Material, THREE.Material>();
  const wash = tint
    ? new THREE.Color(1, 1, 1).lerp(new THREE.Color(tint), tintAmount)
    : null;

  const grade = (source: THREE.Material) => {
    const cached = graded.get(source);
    if (cached) return cached;

    const material = source.clone() as THREE.MeshStandardMaterial;

    if (wash) material.color.multiply(wash);

    // A map at the renderer's maximum anisotropy is wasted on a model looked at
    // from a few metres; 8 is the point beyond which nothing is gained here.
    if (material.map) material.map.anisotropy = Math.min(material.map.anisotropy, 8);

    if (quality === "low") {
      const physical = material as THREE.MeshPhysicalMaterial;
      if (typeof physical.transmission === "number" && physical.transmission > 0) {
        physical.transmission = 0;
        physical.transparent = true;
        physical.opacity = Math.min(physical.opacity, 0.62);
        physical.roughness = Math.min(physical.roughness, 0.14);
      }
      if (physical.clearcoat > 0) physical.clearcoat = 0;
      material.flatShading = false;
    }

    graded.set(source, material);
    return material;
  };

  root.traverse((node) => {
    const mesh = node as THREE.Mesh;
    if (!mesh.isMesh || !mesh.material) return;
    mesh.material = Array.isArray(mesh.material)
      ? mesh.material.map(grade)
      : grade(mesh.material);
  });
}

type Grade = { tint?: string; tintAmount: number; quality: ModelQuality };

/** World-space bounds of the solid geometry in a hierarchy. */
function measureModel(root: THREE.Object3D): THREE.Box3 {
  const parts: THREE.Box3[] = [];
  root.updateWorldMatrix(true, true);
  root.traverse((node) => {
    if (!(node as THREE.Mesh).isMesh) return;
    const box = new THREE.Box3().setFromObject(node);
    if (!box.isEmpty()) parts.push(box);
  });

  if (parts.length === 0) return new THREE.Box3().setFromObject(root);

  const everything = new THREE.Box3();
  for (const part of parts) everything.union(part);

  const overall = everything.getSize(new THREE.Vector3());
  const threshold = Math.max(overall.x, overall.y, overall.z) * SOLID_ENOUGH;

  const solid = new THREE.Box3();
  const size = new THREE.Vector3();
  for (const part of parts) {
    part.getSize(size);
    if (Math.min(size.x, size.y, size.z) > threshold) solid.union(part);
  }

  return solid.isEmpty() ? everything : solid;
}

type Props = {
  url: string;
  fit: Fit;
  anchor?: "base" | "center";
  onReady?: () => void;
  onMeasure?: (size: ModelSize) => void;
  /** Scroll position (0 → 1) to scrub the model's first animation with. */
  progress?: RefObject<number>;
  fallback?: ReactNode;
  /** Colour the file is graded towards, as a multiply over its own materials. */
  tint?: string;
  /** How far towards `tint` the grade goes — 0 leaves the file untouched. */
  tintAmount?: number;
  /** `low` drops the settings that cost the most on a phone. */
  quality?: ModelQuality;
};

function Model({
  url,
  fit,
  anchor = "base",
  onReady,
  onMeasure,
  progress,
  tint,
  tintAmount = 0.22,
  quality = "high",
}: Props) {
  const gltf = useLoader(GLTFLoader, url, configureGltfLoader);
  const ready = useRef(onReady);
  ready.current = onReady;
  const measure = useRef(onMeasure);
  measure.current = onMeasure;
  const fitted = useRef<ModelSize | null>(null);

  const { width, height, depth } = fit;

  const scrub = useRef<{
    mixer: THREE.AnimationMixer;
    action: THREE.AnimationAction;
    duration: number;
  } | null>(null);

  const object = useMemo(() => {
    const root = gltf.scene.clone(true);
    // Grade before measuring: neither the tint nor the quality pass moves a
    // vertex, so the fit is the same either way, and doing it here keeps the
    // work out of the render loop.
    prepareMaterials(root, { tint, tintAmount, quality });

    const box = measureModel(root);

    const size = box.getSize(new THREE.Vector3());
    const centre = box.getCenter(new THREE.Vector3());

    const ratios: number[] = [];
    if (width) ratios.push(width / (size.x || 1));
    if (height) ratios.push(height / (size.y || 1));
    if (depth) ratios.push(depth / (size.z || 1));
    const scale = ratios.length > 0 ? Math.min(...ratios) : 1;

    fitted.current = {
      width: size.x * scale,
      height: size.y * scale,
      depth: size.z * scale,
    };

    root.scale.setScalar(scale);
    root.position.set(
      -centre.x * scale,
      (anchor === "base" ? -box.min.y : -centre.y) * scale,
      -centre.z * scale,
    );

    const group = new THREE.Group();
    group.add(root);
    return group;
  }, [gltf, width, height, depth, anchor, tint, tintAmount, quality]);

  // Once the model is in the scene, report what it measures and let the section
  // retire its fallback.
  useEffect(() => {
    if (fitted.current) measure.current?.(fitted.current);
    ready.current?.();
  }, []);

  // A clip that arrived with the model is scrubbed by scroll rather than played
  // on a clock: the section already owns a progress value, and a scrubbed clip
  // holds exactly where the visitor left it and runs backwards on the way up,
  // which is how the sequence is read anyway. Nothing drifts and nothing has to
  // be reset.
  useEffect(() => {
    if (!progress || gltf.animations.length === 0) return undefined;

    const clip = gltf.animations[0];
    const mixer = new THREE.AnimationMixer(object);
    const action = mixer.clipAction(clip);
    action.play();
    scrub.current = { mixer, action, duration: clip.duration };

    return () => {
      mixer.stopAllAction();
      mixer.uncacheRoot(object);
      scrub.current = null;
    };
  }, [gltf, object, progress]);

  useFrame(() => {
    const state = scrub.current;
    if (!state) return;
    const p = Math.min(1, Math.max(0, progress?.current ?? 0));
    // The time is set rather than advanced, and the mixer is then evaluated
    // without advancing it. `mixer.setTime` would be the obvious call, but it
    // runs the action through its loop: the last frame wraps back to the first,
    // so the settled state the visitor scrolls *to* would never be reachable.
    state.action.time = p * state.duration;
    state.mixer.update(0);
  });

  return <primitive object={object} />;
}

/** Errors thrown while loading are render-phase, so a boundary catches them. */
class ModelBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export function GltfModel({ fallback = null, ...props }: Props) {
  return (
    <ModelBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <Model {...props} />
      </Suspense>
    </ModelBoundary>
  );
}
