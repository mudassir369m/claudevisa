"use client";
import { useRef } from "react";

export default function Tilt({
  children,
  className = "",
  max = 8,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1000px) rotateY(${px * max}deg) rotateX(${-py * max}deg) translateY(-4px)`;
  }
  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(1000px) rotateY(0) rotateX(0) translateY(0)";
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`tilt-card ${className}`}
    >
      {children}
    </div>
  );
}
