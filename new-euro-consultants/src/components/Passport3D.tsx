"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useIsMobile } from "@/lib/three-utils";

export default function Passport3D() {
  const mount = useRef<HTMLDivElement>(null);
  const mobile = useIsMobile();

  useEffect(() => {
    const m = mount.current;
    if (!m || mobile) return;

    const W = m.clientWidth;
    const H = m.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(W, H);
    m.appendChild(renderer.domElement);

    // passport group
    const passport = new THREE.Group();
    scene.add(passport);

    // cover
    const coverGeo = new THREE.BoxGeometry(2.2, 3.1, 0.12, 2, 2, 1);
    const coverMat = new THREE.MeshStandardMaterial({
      color: 0x0a3d20,
      roughness: 0.55,
      metalness: 0.15,
    });
    const cover = new THREE.Mesh(coverGeo, coverMat);
    passport.add(cover);

    // pages (stacked planes)
    for (let i = 0; i < 6; i++) {
      const p = new THREE.Mesh(
        new THREE.PlaneGeometry(2.08, 2.98),
        new THREE.MeshStandardMaterial({
          color: 0xf5f0e1,
          roughness: 0.9,
          side: THREE.DoubleSide,
        })
      );
      p.position.z = 0.07 - i * 0.005;
      passport.add(p);
    }

    // gold emblem
    const emblemCanvas = document.createElement("canvas");
    emblemCanvas.width = 512;
    emblemCanvas.height = 512;
    const ctx = emblemCanvas.getContext("2d")!;
    // background
    ctx.fillStyle = "#0a3d20";
    ctx.fillRect(0, 0, 512, 512);
    // gold ring
    ctx.strokeStyle = "#D4AF37";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(256, 260, 90, 0, Math.PI * 2);
    ctx.stroke();
    // crescent + star
    ctx.fillStyle = "#D4AF37";
    ctx.font = "bold 140px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("☪", 256, 270);
    // text
    ctx.font = "bold 22px sans-serif";
    ctx.fillStyle = "#D4AF37";
    ctx.fillText("ISLAMIC REPUBLIC OF", 256, 130);
    ctx.font = "bold 34px sans-serif";
    ctx.fillText("PAKISTAN", 256, 170);
    ctx.font = "bold 26px sans-serif";
    ctx.fillText("PASSPORT", 256, 400);

    const emblemTex = new THREE.CanvasTexture(emblemCanvas);
    const emblem = new THREE.Mesh(
      new THREE.PlaneGeometry(2.2, 3.1),
      new THREE.MeshBasicMaterial({ map: emblemTex, transparent: true })
    );
    emblem.position.z = 0.061;
    passport.add(emblem);

    // lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const key = new THREE.DirectionalLight(0xf5e6b8, 1.4);
    key.position.set(4, 5, 6);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x5b8def, 0.6);
    rim.position.set(-4, 2, -3);
    scene.add(rim);

    // interaction: scroll + mouse tilt
    let scrollY = window.scrollY;
    let mouseX = 0;
    let mouseY = 0;

    const onScroll = () => (scrollY = window.scrollY);
    const onMouse = (e: MouseEvent) => {
      const r = m.getBoundingClientRect();
      mouseX = ((e.clientX - r.left) / r.width - 0.5) * 2;
      mouseY = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    m.addEventListener("mousemove", onMouse);

    let raf = 0;
    let t = 0;
    const render = () => {
      raf = requestAnimationFrame(render);
      t += 0.01;
      passport.rotation.y = -0.3 + mouseX * 0.4 + Math.sin(scrollY * 0.002) * 0.3;
      passport.rotation.x = 0.1 - mouseY * 0.25 + Math.cos(scrollY * 0.0015) * 0.1;
      passport.position.y = Math.sin(t) * 0.1;
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
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      m.removeEventListener("mousemove", onMouse);
      coverGeo.dispose();
      coverMat.dispose();
      emblemTex.dispose();
      renderer.dispose();
      if (m.contains(renderer.domElement)) m.removeChild(renderer.domElement);
    };
  }, [mobile]);

  if (mobile) return null;
  return <div ref={mount} className="h-full w-full" aria-hidden />;
}
