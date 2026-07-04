"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ScoreGauge({ value }: { value: number }) {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const m = mount.current;
    if (!m) return;

    const W = m.clientWidth;
    const H = m.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(W, H);
    m.appendChild(renderer.domElement);

    // color by score band
    const color =
      value >= 70 ? 0x34d399 : value >= 45 ? 0xd4af37 : 0xf43f5e;

    // bg ring (dim)
    const bgGeo = new THREE.TorusGeometry(1.4, 0.08, 20, 96);
    const bgMat = new THREE.MeshBasicMaterial({ color: 0x1a2540, transparent: true, opacity: 0.6 });
    const bg = new THREE.Mesh(bgGeo, bgMat);
    scene.add(bg);

    // progress arc (partial torus)
    const arcCount = Math.round((value / 100) * 96);
    const arcGeo = new THREE.TorusGeometry(1.4, 0.11, 20, 96, (arcCount / 96) * Math.PI * 2);
    const arcMat = new THREE.MeshBasicMaterial({ color });
    const arc = new THREE.Mesh(arcGeo, arcMat);
    arc.rotation.z = Math.PI / 2;
    scene.add(arc);

    // glow ring behind
    const glowGeo = new THREE.TorusGeometry(1.4, 0.24, 20, 96, (arcCount / 96) * Math.PI * 2);
    const glowMat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.rotation.z = Math.PI / 2;
    scene.add(glow);

    // sparkles at arc tip
    const sparkGeo = new THREE.BufferGeometry();
    const sparkN = 30;
    const spos = new Float32Array(sparkN * 3);
    const angle = -Math.PI / 2 + (value / 100) * Math.PI * 2;
    for (let i = 0; i < sparkN; i++) {
      const jitter = (Math.random() - 0.5) * 0.4;
      spos[i * 3] = Math.cos(angle) * (1.4 + jitter * 0.3);
      spos[i * 3 + 1] = Math.sin(angle) * (1.4 + jitter * 0.3);
      spos[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
    }
    sparkGeo.setAttribute("position", new THREE.BufferAttribute(spos, 3));
    const spark = new THREE.Points(
      sparkGeo,
      new THREE.PointsMaterial({
        color,
        size: 0.08,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
      })
    );
    scene.add(spark);

    let raf = 0;
    let t = 0;
    const render = () => {
      raf = requestAnimationFrame(render);
      t += 0.03;
      scene.rotation.z = -0.2 + Math.sin(t * 0.3) * 0.02;
      spark.material.opacity = 0.6 + Math.sin(t * 3) * 0.3;
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
      window.removeEventListener("resize", onResize);
      [bgGeo, arcGeo, glowGeo, sparkGeo].forEach((g) => g.dispose());
      [bgMat, arcMat, glowMat, spark.material as THREE.Material].forEach((mat) => mat.dispose());
      renderer.dispose();
      if (m.contains(renderer.domElement)) m.removeChild(renderer.domElement);
    };
  }, [value]);

  return <div ref={mount} className="absolute inset-0" aria-hidden />;
}
