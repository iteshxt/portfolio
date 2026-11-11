"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { StageInput } from "./StarScene";

/**
 * DiaChat's object: a squishy speech bubble with a sticker-style ink outline
 * and typing dots. It breathes, follows the pointer, and jiggles like jelly
 * when poked (a damped spring drives the squash and stretch).
 */
export function ChatBubble({ hover, poke, lite }: StageInput) {
  const group = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const dots = useRef<THREE.Mesh[]>([]);
  const spring = useRef({ x: 0, v: 0 });
  const lastPoke = useRef(0);
  const wasHover = useRef(false);
  const seg = lite ? 24 : 48;
  const sphere = useMemo(() => new THREE.SphereGeometry(1, seg, Math.round(seg * 0.66)), [seg]);
  const cone = useMemo(() => new THREE.ConeGeometry(0.3, 0.7, seg), [seg]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 20);
    const t = state.clock.elapsedTime;
    const sp = spring.current;
    if (poke.current !== lastPoke.current) {
      lastPoke.current = poke.current;
      sp.v += 9;
    }
    if (hover.current && !wasHover.current) sp.v += 4;
    wasHover.current = hover.current;
    // Damped spring: x'' = -k x - c x'
    sp.v += (-120 * sp.x - 7 * sp.v) * dt;
    sp.x += sp.v * dt;

    const breathe = Math.sin(t * 2.2) * 0.025;
    const squash = breathe + sp.x * 0.1;
    if (body.current) body.current.scale.set(1 + squash, 1 - squash, 1 + squash * 0.5);

    dots.current.forEach((d, i) => {
      d.position.y = Math.max(0, Math.sin(t * 6 - i * 0.9)) * 0.12;
    });

    const g = group.current;
    if (g) {
      const k = Math.min(1, dt * 2.5);
      const px = hover.current ? state.pointer.x : 0;
      const py = hover.current ? state.pointer.y : 0;
      g.rotation.y += (px * 0.6 - g.rotation.y) * k;
      g.rotation.x += (-py * 0.4 - g.rotation.x) * k;
      g.position.y = Math.sin(t * 1.1) * 0.08;
    }
  });

  return (
    <group ref={group} scale={0.95}>
      <group ref={body}>
        {/* Ink outline: slightly larger back faces, like a die-cut sticker edge */}
        <mesh geometry={sphere} scale={[1.62, 1.12, 0.68]}>
          <meshBasicMaterial color="#0E0E10" side={THREE.BackSide} />
        </mesh>
        <mesh geometry={sphere} scale={[1.55, 1.05, 0.62]}>
          <meshStandardMaterial color="#FFFFFF" roughness={0.45} />
        </mesh>
        <group position={[-0.95, -0.95, 0]} rotation={[0, 0, 2.5]}>
          <mesh geometry={cone} scale={1.12}>
            <meshBasicMaterial color="#0E0E10" side={THREE.BackSide} />
          </mesh>
          <mesh geometry={cone}>
            <meshStandardMaterial color="#FFFFFF" roughness={0.45} />
          </mesh>
        </group>
        {[-0.45, 0, 0.45].map((x, i) => (
          <group key={x} position={[x, 0, 0.66]}>
            <mesh
              ref={(el) => {
                if (el) dots.current[i] = el;
              }}
            >
              <sphereGeometry args={[0.13, 20, 20]} />
              <meshStandardMaterial color="#0E0E10" roughness={0.4} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
