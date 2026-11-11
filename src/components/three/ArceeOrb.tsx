"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { StageInput } from "./StarScene";

/**
 * Arcee's identity as an object: amber rings woven around a geodesic
 * wireframe core. Idle it drifts; hovered it "thinks" (rings speed up);
 * a click gives it a burst. It turns gently towards the pointer.
 */
export function ArceeOrb({ hover, poke, lite }: StageInput) {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.LineSegments>(null);
  const rings = useRef<THREE.Mesh[]>([]);
  const speed = useRef(1);
  const lastPoke = useRef(0);

  const ringDefs = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        rotation: [(i * Math.PI) / 6, i * 0.9, i * 0.4] as [number, number, number],
        spin: (0.25 + i * 0.07) * (i % 2 ? 1 : -1),
        squash: 0.6 + (i % 3) * 0.08,
      })),
    [],
  );
  const coreEdges = useMemo(() => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.62, 1)), []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 20);
    if (poke.current !== lastPoke.current) {
      lastPoke.current = poke.current;
      speed.current = 9;
    }
    const target = hover.current ? 3.2 : 1;
    speed.current += (target - speed.current) * Math.min(1, dt * 2.5);

    rings.current.forEach((ring, i) => {
      ring.rotation.z += dt * ringDefs[i].spin * speed.current;
      ring.rotation.x += dt * 0.04 * speed.current * (i % 2 ? 1 : -1);
    });
    if (core.current) {
      core.current.rotation.y += dt * 0.35 * speed.current;
      core.current.rotation.x += dt * 0.12;
    }
    const g = group.current;
    if (g) {
      const k = Math.min(1, dt * 2);
      const px = hover.current ? state.pointer.x : 0;
      const py = hover.current ? state.pointer.y : 0;
      g.rotation.y += (px * 0.5 - g.rotation.y) * k;
      g.rotation.x += (-py * 0.35 - g.rotation.x) * k;
      g.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.06;
    }
  });

  return (
    <group ref={group} scale={1.08}>
      {ringDefs.map((d, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) rings.current[i] = el;
          }}
          rotation={d.rotation}
          scale={[1, d.squash, 1]}
        >
          <torusGeometry args={[1.55, 0.013, 6, lite ? 120 : 240]} />
          <meshBasicMaterial color="#FFC24A" transparent opacity={0.85} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
      <lineSegments ref={core} geometry={coreEdges}>
        <lineBasicMaterial color="#FFD98A" transparent opacity={0.95} />
      </lineSegments>
      <mesh>
        <sphereGeometry args={[0.6, lite ? 16 : 32, lite ? 16 : 32]} />
        <meshBasicMaterial color="#FFB347" transparent opacity={0.14} depthWrite={false} />
      </mesh>
    </group>
  );
}
