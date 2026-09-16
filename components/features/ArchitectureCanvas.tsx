"use client";

import { useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Architectural scene.
 *
 * A stylised massing of the two towers — stone podium, six residential
 * levels, deep balcony shadow — lit for dusk. The camera is choreographed by
 * scroll (exterior → arrival → lobby → residence → rooftop) with a little
 * pointer parallax. Nothing rotates for the sake of it.
 */

type Quality = "high" | "low";

const STAGES = [
  { pos: [18.5, 7.2, 20], look: [0, 3.4, 0] },
  { pos: [11.5, 2.9, 13.5], look: [0, 2.6, 0] },
  { pos: [3.4, 2.1, 8.6], look: [0, 2.1, 0] },
  { pos: [-4.6, 5.6, 7.4], look: [0, 4.7, 0] },
  { pos: [-10.5, 10.2, 11], look: [0, 7.6, 0] },
];

const smoothstep = (t: number) => t * t * (3 - 2 * t);

function CameraRig({ progress }: { progress: RefObject<number> }) {
  const { camera } = useThree();
  const pointer = useRef({ x: 0, y: 0 });
  const smooth = useRef(0);
  const target = useMemo(() => new THREE.Vector3(), []);
  const desired = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const p = Math.min(1, Math.max(0, progress.current ?? 0));
    // damped follow so the move feels weighted rather than linear
    smooth.current += (p - smooth.current) * Math.min(1, delta * 3.2);
    const scaled = smooth.current * (STAGES.length - 1);
    const index = Math.min(STAGES.length - 2, Math.floor(scaled));
    const local = smoothstep(scaled - index);

    const a = STAGES[index];
    const b = STAGES[index + 1];

    desired.set(
      a.pos[0] + (b.pos[0] - a.pos[0]) * local,
      a.pos[1] + (b.pos[1] - a.pos[1]) * local,
      a.pos[2] + (b.pos[2] - a.pos[2]) * local,
    );

    const pointerState = state.pointer;
    pointer.current.x += (pointerState.x - pointer.current.x) * 0.05;
    pointer.current.y += (pointerState.y - pointer.current.y) * 0.05;

    desired.x += pointer.current.x * 0.9;
    desired.y -= pointer.current.y * 0.55;

    camera.position.lerp(desired, Math.min(1, delta * 2.6));

    target.set(
      a.look[0] + (b.look[0] - a.look[0]) * local + pointer.current.x * 0.3,
      a.look[1] + (b.look[1] - a.look[1]) * local - pointer.current.y * 0.25,
      a.look[2] + (b.look[2] - a.look[2]) * local,
    );
    camera.lookAt(target);
  });

  return null;
}

function Trees({ quality }: { quality: Quality }) {
  const spots = useMemo(() => {
    const base = [
      [-8.5, 0, 5.5, 1.5],
      [-6.6, 0, 7.2, 1.1],
      [9.2, 0, 4.4, 1.3],
      [11.4, 0, 1.6, 1.6],
      [-11.5, 0, -2.5, 1.2],
      [6.4, 0, 8.6, 0.9],
    ];
    return quality === "high" ? base : base.slice(0, 4);
  }, [quality]);

  return (
    <group>
      {spots.map(([x, , z, s], i) => (
        <group key={i} position={[x, 0, z]} scale={s}>
          <mesh position={[0, 1.1, 0]}>
            <icosahedronGeometry args={[1, 1]} />
            <meshStandardMaterial color="#1e2419" roughness={0.95} />
          </mesh>
          <mesh position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.09, 0.12, 0.7, 6]} />
            <meshStandardMaterial color="#2a241d" roughness={1} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Massing({ quality, progress }: { quality: Quality; progress: RefObject<number> }) {
  const floors = 6;
  const windowRefs = useRef<THREE.MeshBasicMaterial[]>([]);

  // Windows wake up as the sequence moves from exterior to residence.
  useFrame(() => {
    const p = progress.current ?? 0;
    windowRefs.current.forEach((material, i) => {
      if (!material) return;
      const delay = (i % 5) * 0.05;
      const amount = Math.max(0, Math.min(1, (p - 0.08 - delay) * 3.4));
      material.opacity = 0.06 + amount * 0.62;
    });
  });

  const fins = quality === "high" ? 11 : 6;
  const windowsPerFloor = quality === "high" ? 5 : 3;

  return (
    <group position={[0, 0, 0]}>
      {/* ground + plaza */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[34, 48]} />
        <meshStandardMaterial color="#0c0c0d" roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[3, 0.012, 3]}>
        <ringGeometry args={[10, 17, 48]} />
        <meshStandardMaterial color="#171614" roughness={0.85} />
      </mesh>

      {/* reflecting pool */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[7.6, 0.02, -3.2]}>
        <planeGeometry args={[7, 3.4]} />
        <meshStandardMaterial color="#0f1620" roughness={0.14} metalness={0.5} />
      </mesh>

      {/* podium */}
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[11.4, 1.5, 7.6]} />
        <meshStandardMaterial color="#8b8274" roughness={0.88} />
      </mesh>
      {quality === "high" ? (
        <mesh position={[0, 1.52, 0]}>
          <boxGeometry args={[11.6, 0.06, 7.8]} />
          <meshStandardMaterial color="#d8cfbd" roughness={0.6} />
        </mesh>
      ) : null}

      {/* tower levels */}
      {Array.from({ length: floors }, (_, floor) => {
        const y = 1.9 + floor * 1.06;
        return (
          <group key={floor}>
            <mesh position={[0, y, 0]}>
              <boxGeometry args={[7.6, 0.36, 5.4]} />
              <meshStandardMaterial color="#3b3936" roughness={0.75} />
            </mesh>
            <mesh position={[0, y + 0.5, 0]}>
              <boxGeometry args={[7.15, 0.66, 4.95]} />
              <meshStandardMaterial color="#0d1319" roughness={0.2} metalness={0.62} />
            </mesh>
            {/* warm interior light strips */}
            {Array.from({ length: windowsPerFloor }, (_, w) => {
              const windowX = (w - (windowsPerFloor - 1) / 2) * 1.28;
              return (
                <mesh key={w} position={[windowX, y + 0.5, 2.49]}>
                  <planeGeometry args={[0.72, 0.34]} />
                  <meshBasicMaterial
                    ref={(material) => {
                      if (material) windowRefs.current[floor * windowsPerFloor + w] = material;
                    }}
                    color="#ffc98a"
                    transparent
                    opacity={0.1}
                    toneMapped={false}
                  />
                </mesh>
              );
            })}
          </group>
        );
      })}

      {/* facade fins */}
      {Array.from({ length: fins }, (_, i) => {
        const x = -3.5 + (i * 7) / (fins - 1);
        return (
          <mesh key={i} position={[x, 5.4, 2.7]}>
            <boxGeometry args={[0.09, 6.4, 0.34]} />
            <meshStandardMaterial color="#cec5b2" roughness={0.62} />
          </mesh>
        );
      })}

      {/* roof pavilion + parapet */}
      <mesh position={[0, 8.44, 0]}>
        <boxGeometry args={[7.8, 0.22, 5.5]} />
        <meshStandardMaterial color="#4a4741" roughness={0.8} />
      </mesh>
      <mesh position={[-2.1, 9.1, 0.4]}>
        <boxGeometry args={[2.6, 1.3, 1.9]} />
        <meshStandardMaterial color="#2b2a27" roughness={0.7} />
      </mesh>
      <mesh position={[2.6, 8.9, -1]}>
        <boxGeometry args={[1.4, 0.9, 1.4]} />
        <meshStandardMaterial color="#232220" roughness={0.8} />
      </mesh>

      <Trees quality={quality} />
    </group>
  );
}

function Sky({ progress }: { progress: RefObject<number> }) {
  const { scene } = useThree();
  const dusk = useMemo(() => new THREE.Color("#151a22"), []);
  const night = useMemo(() => new THREE.Color("#05070b"), []);
  const fog = useMemo(() => new THREE.Fog("#12161d", 22, 52), []);

  scene.fog = fog;

  useFrame(() => {
    const p = progress.current ?? 0;
    fog.color.copy(dusk).lerp(night, Math.min(1, p * 1.3));
    fog.near = 22 - p * 6;
    fog.far = 52 - p * 10;
  });

  return null;
}

export default function ArchitectureCanvas({
  progress,
  quality = "high",
  frameloop = "always",
}: {
  progress: RefObject<number>;
  quality?: Quality;
  frameloop?: "always" | "never";
}) {
  return (
    <Canvas
      dpr={quality === "high" ? [1, 1.75] : [1, 1.3]}
      frameloop={frameloop}
      camera={{ position: [18.5, 7.2, 20], fov: 30, near: 0.1, far: 120 }}
      gl={{ antialias: quality === "high", alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
    >
      <Sky progress={progress} />
      <CameraRig progress={progress} />
      <ambientLight intensity={0.42} />
      <hemisphereLight args={["#c9d6e6", "#241f18", 0.35]} />
      <directionalLight position={[14, 20, 9]} intensity={1.35} color="#ffe0b4" />
      <directionalLight position={[-12, 8, -10]} intensity={0.5} color="#8ea6c4" />
      <pointLight position={[3, 2.4, 5.4]} intensity={26} distance={16} color="#ffb46c" />
      <Massing quality={quality} progress={progress} />
    </Canvas>
  );
}
