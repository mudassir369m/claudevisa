"use client";
import { useEffect } from "react";

export default function CustomCursor() {
  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;

    const dot = document.createElement("div");
    const ring = document.createElement("div");
    dot.className = "cur-dot";
    ring.className = "cur-ring";
    document.body.append(dot, ring);

    const style = document.createElement("style");
    style.textContent = `
      .cur-dot,.cur-ring{position:fixed;top:0;left:0;pointer-events:none;z-index:9999;border-radius:9999px;transform:translate3d(-100px,-100px,0);will-change:transform;mix-blend-mode:screen}
      .cur-dot{width:8px;height:8px;background:#D4AF37}
      .cur-ring{width:34px;height:34px;border:1px solid rgba(212,175,55,.55);transition:transform .12s ease-out,width .25s,height .25s,border-color .25s}
      .cur-ring.hover{width:56px;height:56px;border-color:rgba(212,175,55,.9)}
      * { cursor: none !important; }
      a,button,input,textarea,select,[role=button]{cursor:none !important}
      @media(hover:none){.cur-dot,.cur-ring{display:none}*{cursor:auto !important}}
    `;
    document.head.appendChild(style);

    let mx = -100, my = -100;
    let rx = -100, ry = -100;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate3d(${mx - 4}px,${my - 4}px,0)`;
    };
    window.addEventListener("mousemove", onMove);

    const isInteractive = (el: EventTarget | null) => {
      if (!(el instanceof Element)) return false;
      return !!el.closest("a,button,[role=button],input,textarea,select,.magnetic");
    };
    const onOver = (e: MouseEvent) => {
      if (isInteractive(e.target)) ring.classList.add("hover");
      else ring.classList.remove("hover");
    };
    window.addEventListener("mouseover", onOver);

    let raf = 0;
    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate3d(${rx - 17}px,${ry - 17}px,0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      dot.remove();
      ring.remove();
      style.remove();
    };
  }, []);

  return null;
}
