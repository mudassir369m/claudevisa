"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useIsMobile } from "@/lib/three-utils";

export default function ParticleField({ count = 900 }: { count?: number }) {
  const mount = useRef<HTMLDivElement>(null);
  const mobile = useIsMobile();
  const N = mobile ? Math.min(count, 300) : count;

  useEffect(() => {
    const m = mount.current;
    if (!m) return;

    const W = m.clientWidth;
    const H = m.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(W, H);
    m.appendChild(renderer.domElement);

    // three depth layers for parallax
    const layers: THREE.Points[] = [];
    const colors = [0xd4af37, 0x5b8def, 0xf0d78a];
    const sizes = [0.03, 0.05, 0.08];
    const zRanges = [[-8, -4], [-4, -1], [-1, 3]];

    for (let l = 0; l < 3; l++) {
      const pos = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 20;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
        pos[i * 3 + 2] = zRanges[l][0] + Math.random() * (zRanges[l][1] - zRanges[l][0]);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({
        color: colors[l],
        size: sizes[l],
        transparent: true,
        opacity: 0.55 + l * 0.15,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const pts = new THREE.Points(geo, mat);
      scene.add(pts);
      layers.push(pts);
    }

    let mx = 0;
    let my = 0;
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / innerWidth - 0.5) * 2;
      my = (e.clientY / innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    let raf = 0;
    let t = 0;
    const render = () => {
      raf = requestAnimationFrame(render);
      t += 0.002;
      layers.forEach((p, i) => {
        p.rotation.y = t * (0.05 + i * 0.03);
        p.position.x = mx * (0.3 + i * 0.4);
        p.position.y = -my * (0.2 + i * 0.3);
      });
      renderer.render(scene, camera);
    };
    render();

    const onResize = () => {
      const w = m.clientWidth;
      const h = m.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      layers.forEach((p) => {
        p.geometry.dispose();
        (p.material as THREE.Material).dispose();
      });
      renderer.dispose();
      if (m.contains(renderer.domElement)) m.removeChild(renderer.domElement);
    };
  }, [N]);

  return <div ref={mount} className="pointer-events-none absolute inset-0" aria-hidden />;
}
