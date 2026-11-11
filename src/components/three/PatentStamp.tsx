"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { StageInput } from "./StarScene";

const CYCLE = 2.8; // seconds per stamp
const UP = 0.35;
const CONTACT = -0.86;

/** "VERIFIED" impression texture, owned at module level (one stamp per page). */
let impression: THREE.CanvasTexture | null = null;

function impressionTexture(): THREE.CanvasTexture {
  if (impression) return impression;
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 240;
  impression = new THREE.CanvasTexture(canvas);
  impression.colorSpace = THREE.SRGBColorSpace;
  impression.anisotropy = 4;
  return impression;
}

/** Draws the mark with the site's serif; called again once the font has loaded. */
function drawImpression(family: string) {
  const texture = impressionTexture();
  const canvas = texture.image as HTMLCanvasElement;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#FF4B2B";
  ctx.fillStyle = "#FF4B2B";
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.roundRect(14, 14, canvas.width - 28, canvas.height - 28, 26);
  ctx.stroke();
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(36, 36, canvas.width - 72, canvas.height - 72, 14);
  ctx.stroke();
  ctx.font = `400 136px ${family}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("VERIFIED", canvas.width / 2, canvas.height / 2 + 8);
  texture.needsUpdate = true;
}

function useImpressionTexture() {
  const texture = useMemo(() => impressionTexture(), []);
  useEffect(() => {
    const family = getComputedStyle(document.documentElement).getPropertyValue("--font-instrument-serif").trim() || "serif";
    drawImpression(family);
    document.fonts.load(`136px ${family}`).then(() => drawImpression(family), () => {});
  }, []);
  return texture;
}

/**
 * PatentIQ's object: a rubber stamp that keeps verifying a sheet of paper.
 * It hovers, slams, squashes and leaves a fading "VERIFIED" mark. A click
 * makes it stamp right away; it leans towards the pointer.
 */
export function PatentStamp({ hover, poke, lite }: StageInput) {
  const scene = useRef<THREE.Group>(null);
  const stamp = useRef<THREE.Group>(null);
  const mark = useRef<THREE.MeshBasicMaterial>(null);
  const clock = useRef(0);
  const lastPoke = useRef(0);
  const stamped = useRef(false);
  const texture = useImpressionTexture();
  const seg = lite ? 16 : 32;

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 20);
    if (poke.current !== lastPoke.current) {
      lastPoke.current = poke.current;
      if (clock.current < 0.85 || clock.current > 1.7) clock.current = 0.85;
    }
    clock.current = (clock.current + dt) % CYCLE;
    const t = clock.current;

    let y = UP + Math.sin(state.clock.elapsedTime * 2) * 0.04;
    let squash = 1;
    let tilt = Math.sin(state.clock.elapsedTime * 1.3) * 0.06;
    if (t >= 0.85 && t < 1.0) {
      const k = (t - 0.85) / 0.15;
      y = UP + (CONTACT - UP) * k * k;
      tilt = 0;
    } else if (t >= 1.0 && t < 1.55) {
      y = CONTACT;
      tilt = 0;
      squash = 1 - 0.12 * Math.exp(-(t - 1.0) * 14) * Math.cos((t - 1.0) * 30);
      if (!stamped.current) {
        stamped.current = true;
        if (mark.current) mark.current.opacity = 1;
      }
    } else if (t >= 1.55 && t < 2.2) {
      const k = (t - 1.55) / 0.65;
      y = CONTACT + (UP - CONTACT) * (1 - (1 - k) * (1 - k));
    }
    if (t < 0.85 || t >= 2.2) stamped.current = false;

    const s = stamp.current;
    if (s) {
      s.position.y = y;
      s.rotation.z = tilt;
      s.scale.set(1 + (1 - squash) * 0.5, squash, 1 + (1 - squash) * 0.5);
    }
    if (mark.current && t > 1.55) mark.current.opacity = Math.max(0.35, mark.current.opacity - dt * 0.35);

    const g = scene.current;
    if (g) {
      const k = Math.min(1, dt * 2);
      const px = hover.current ? state.pointer.x : 0;
      g.rotation.y += (px * 0.45 - 0.35 - g.rotation.y) * k;
    }
  });

  return (
    <group ref={scene} rotation={[0.45, -0.35, 0]} position={[0, -0.1, 0]} scale={1.05}>
      {/* Paper */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, CONTACT - 0.01, 0]}>
        <planeGeometry args={[3.8, 2.5]} />
        <meshStandardMaterial color="#FFFDF8" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, CONTACT - 0.005, 0]}>
        <planeGeometry args={[1.9, 0.72]} />
        <meshBasicMaterial ref={mark} map={texture} transparent opacity={0.6} depthWrite={false} />
      </mesh>

      {/* Stamp: origin at the bottom of the rubber pad */}
      <group ref={stamp} position={[0, UP, 0]}>
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[1.95, 0.08, 0.78]} />
          <meshStandardMaterial color="#FF4B2B" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[2.05, 0.34, 0.86]} />
          <meshStandardMaterial color="#2A2A30" roughness={0.55} />
        </mesh>
        <mesh position={[0, 0.72, 0]}>
          <cylinderGeometry args={[0.15, 0.2, 0.62, seg]} />
          <meshStandardMaterial color="#FFF1E6" roughness={0.5} />
        </mesh>
        <mesh position={[0, 1.18, 0]}>
          <sphereGeometry args={[0.38, seg, seg]} />
          <meshStandardMaterial color="#FFF1E6" roughness={0.45} />
        </mesh>
      </group>
    </group>
  );
}
