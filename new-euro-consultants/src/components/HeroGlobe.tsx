"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

// Static destination coordinates for the hero globe.
// Kept independent of runtime content so the 3D scene never breaks
// when countries are edited/removed via the admin CMS.
const DESTINATIONS: { lat: number; lng: number }[] = [
  { lat: 51.5, lng: -0.12 },    // UK
  { lat: 38.9, lng: -77.03 },   // USA
  { lat: 45.42, lng: -75.7 },   // Canada
  { lat: -35.28, lng: 149.13 }, // Australia
  { lat: 48.85, lng: 2.35 },    // Schengen (Paris)
  { lat: 39.93, lng: 32.86 },   // Turkey
];

const PAKISTAN = { lat: 33.68, lng: 73.04 };

function latLngToVec3(lat: number, lng: number, r: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

export default function HeroGlobe() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth;
    const H = mount.clientHeight;
    const R = 1.6;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.set(0, 0.4, 5.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    mount.appendChild(renderer.domElement);

    const globe = new THREE.Group();
    scene.add(globe);

    const dotCount = 2600;
    const positions = new Float32Array(dotCount * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < dotCount; i++) {
      const y = 1 - (i / (dotCount - 1)) * 2;
      const rad = Math.sqrt(1 - y * y);
      const theta = golden * i;
      positions[i * 3] = Math.cos(theta) * rad * R;
      positions[i * 3 + 1] = y * R;
      positions[i * 3 + 2] = Math.sin(theta) * rad * R;
    }
    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    globe.add(
      new THREE.Points(
        dotGeo,
        new THREE.PointsMaterial({ color: 0x5b8def, size: 0.016, transparent: true, opacity: 0.75, sizeAttenuation: true })
      )
    );

    const core = new THREE.Mesh(
      new THREE.SphereGeometry(R * 0.985, 48, 48),
      new THREE.MeshBasicMaterial({ color: 0x0a1a33, transparent: true, opacity: 0.92 })
    );
    globe.add(core);

    const atmo = new THREE.Mesh(
      new THREE.SphereGeometry(R * 1.12, 48, 48),
      new THREE.ShaderMaterial({
        transparent: true,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        uniforms: {},
        vertexShader: `varying vec3 vNormal;void main(){vNormal=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
        fragmentShader: `varying vec3 vNormal;void main(){float i=pow(0.62-dot(vNormal,vec3(0,0,1.0)),2.2);gl_FragColor=vec4(0.36,0.55,0.94,1.0)*i;}`,
      })
    );
    scene.add(atmo);

    const pkPos = latLngToVec3(PAKISTAN.lat, PAKISTAN.lng, R * 1.01);
    const markerGroup = new THREE.Group();
    globe.add(markerGroup);

    const pkMarker = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xd4af37 })
    );
    pkMarker.position.copy(pkPos);
    markerGroup.add(pkMarker);

    const pkRing = new THREE.Mesh(
      new THREE.RingGeometry(0.06, 0.09, 32),
      new THREE.MeshBasicMaterial({ color: 0xd4af37, transparent: true, opacity: 0.8, side: THREE.DoubleSide })
    );
    pkRing.position.copy(pkPos.clone().multiplyScalar(1.005));
    pkRing.lookAt(pkPos.clone().multiplyScalar(2));
    markerGroup.add(pkRing);

    type ArcData = { line: THREE.Line; drawn: number; total: number; head: THREE.Mesh };
    const arcs: ArcData[] = [];

    DESTINATIONS.forEach((c, idx) => {
      const dest = latLngToVec3(c.lat, c.lng, R * 1.01);
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(0.035, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0x5b8def })
      );
      m.position.copy(dest);
      markerGroup.add(m);

      const mid = pkPos.clone().add(dest).multiplyScalar(0.5);
      const dist = pkPos.distanceTo(dest);
      mid.normalize().multiplyScalar(R * (1.15 + dist * 0.18));
      const curve = new THREE.QuadraticBezierCurve3(pkPos.clone(), mid, dest.clone());
      const pts = curve.getPoints(64);
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      geo.setDrawRange(0, 0);
      const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0xd4af37, transparent: true, opacity: 0.85 }));
      globe.add(line);

      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.02, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xf0d78a })
      );
      head.visible = false;
      globe.add(head);

      arcs.push({ line, drawn: -idx * 26, total: 65, head });
      (line as unknown as { __pts: THREE.Vector3[] }).__pts = pts;
    });

    scene.add(new THREE.AmbientLight(0xffffff, 0.9));

    const orbit = new THREE.Mesh(
      new THREE.TorusGeometry(R * 1.35, 0.004, 8, 128),
      new THREE.MeshBasicMaterial({ color: 0xd4af37, transparent: true, opacity: 0.28 })
    );
    orbit.rotation.x = Math.PI / 2.35;
    scene.add(orbit);

    let dragging = false;
    let px = 0;
    let vel = 0.0022;
    let targetVelBoost = 0;
    const onDown = (e: PointerEvent) => { dragging = true; px = e.clientX; };
    const onUp = () => { dragging = false; };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - px;
      px = e.clientX;
      targetVelBoost = dx * 0.0006;
    };
    renderer.domElement.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointermove", onMove);
    renderer.domElement.style.cursor = "grab";
    renderer.domElement.style.touchAction = "pan-y";

    let raf = 0;
    let t = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      t += 1;
      globe.rotation.y += vel + targetVelBoost;
      targetVelBoost *= 0.94;
      orbit.rotation.z += 0.0016;
      const s = 1 + Math.sin(t * 0.05) * 0.28;
      pkRing.scale.setScalar(s);
      (pkRing.material as THREE.MeshBasicMaterial).opacity = 0.85 - (s - 1) * 1.6;
      arcs.forEach((a) => {
        a.drawn += 0.55;
        const d = Math.max(0, Math.min(a.total, a.drawn));
        (a.line.geometry as THREE.BufferGeometry).setDrawRange(0, Math.floor(d));
        const pts = (a.line as unknown as { __pts: THREE.Vector3[] }).__pts;
        if (d > 0 && d < a.total) {
          a.head.visible = true;
          a.head.position.copy(pts[Math.floor(d)]);
        } else {
          a.head.visible = false;
        }
        if (a.drawn > a.total + 70) a.drawn = -20;
      });
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointermove", onMove);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="h-full w-full" aria-hidden />;
}
