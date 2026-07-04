"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const PK = { lat: 33.68, lng: 73.04 };

function llToVec3(lat: number, lng: number, r: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

export default function MiniGlobe({ lat, lng }: { lat: number; lng: number }) {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const m = mount.current;
    if (!m) return;

    const W = m.clientWidth;
    const H = m.clientHeight;
    const R = 1.3;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
    camera.position.set(0, 0.2, 4.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(W, H);
    m.appendChild(renderer.domElement);

    const g = new THREE.Group();
    scene.add(g);

    // dot sphere
    const N = 1800;
    const pos = new Float32Array(N * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const rad = Math.sqrt(1 - y * y);
      const th = golden * i;
      pos[i * 3] = Math.cos(th) * rad * R;
      pos[i * 3 + 1] = y * R;
      pos[i * 3 + 2] = Math.sin(th) * rad * R;
    }
    const dg = new THREE.BufferGeometry();
    dg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.add(
      new THREE.Points(
        dg,
        new THREE.PointsMaterial({
          color: 0x5b8def,
          size: 0.016,
          transparent: true,
          opacity: 0.72,
        })
      )
    );

    // core
    g.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(R * 0.985, 40, 40),
        new THREE.MeshBasicMaterial({ color: 0x0a1a33, transparent: true, opacity: 0.92 })
      )
    );

    // atmosphere
    scene.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(R * 1.14, 40, 40),
        new THREE.ShaderMaterial({
          transparent: true,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
          vertexShader: `varying vec3 vN;void main(){vN=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
          fragmentShader: `varying vec3 vN;void main(){float i=pow(0.6-dot(vN,vec3(0,0,1.0)),2.0);gl_FragColor=vec4(0.36,0.55,0.94,1.0)*i;}`,
        })
      )
    );

    // pk (gold) + destination (bigger gold pulse)
    const pkP = llToVec3(PK.lat, PK.lng, R * 1.01);
    const dsP = llToVec3(lat, lng, R * 1.01);

    const pk = new THREE.Mesh(
      new THREE.SphereGeometry(0.035, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xd4af37 })
    );
    pk.position.copy(pkP);
    g.add(pk);

    const ds = new THREE.Mesh(
      new THREE.SphereGeometry(0.055, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xf0d78a })
    );
    ds.position.copy(dsP);
    g.add(ds);

    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.075, 0.11, 32),
      new THREE.MeshBasicMaterial({
        color: 0xd4af37,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide,
      })
    );
    ring.position.copy(dsP.clone().multiplyScalar(1.005));
    ring.lookAt(dsP.clone().multiplyScalar(2));
    g.add(ring);

    // arc
    const mid = pkP.clone().add(dsP).multiplyScalar(0.5).normalize().multiplyScalar(R * 1.35);
    const curve = new THREE.QuadraticBezierCurve3(pkP, mid, dsP);
    const pts = curve.getPoints(64);
    const arcGeo = new THREE.BufferGeometry().setFromPoints(pts);
    arcGeo.setDrawRange(0, 0);
    const arc = new THREE.Line(
      arcGeo,
      new THREE.LineBasicMaterial({ color: 0xd4af37, transparent: true, opacity: 0.9 })
    );
    g.add(arc);

    // rotate so destination faces camera-ish
    const target = dsP.clone().normalize();
    g.rotation.y = -Math.atan2(target.x, target.z);
    g.rotation.x = target.y * 0.35;

    let raf = 0;
    let t = 0;
    let drawn = 0;
    const render = () => {
      raf = requestAnimationFrame(render);
      t += 1;
      g.rotation.y += 0.001;
      const s = 1 + Math.sin(t * 0.06) * 0.35;
      ring.scale.setScalar(s);
      (ring.material as THREE.MeshBasicMaterial).opacity = 0.9 - (s - 1) * 1.4;
      drawn += 0.7;
      if (drawn > 130) drawn = -30;
      arcGeo.setDrawRange(0, Math.max(0, Math.min(64, Math.floor(drawn))));
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
      renderer.dispose();
      if (m.contains(renderer.domElement)) m.removeChild(renderer.domElement);
    };
  }, [lat, lng]);

  return <div ref={mount} className="h-full w-full" aria-hidden />;
}
