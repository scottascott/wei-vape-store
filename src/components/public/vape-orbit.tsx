"use client";

import { useEffect, useRef } from "react";

const VAPES = [
  "/vape-orbit/vape-01.png",
  "/vape-orbit/vape-02.png",
  "/vape-orbit/vape-03.png",
  "/vape-orbit/vape-05.png",
  "/vape-orbit/vape-06.png",
  "/vape-orbit/vape-07.png",
  "/vape-orbit/vape-10.png",
];

export function VapeOrbit() {
  const stageRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let start = performance.now();

    const render = (now: number) => {
      const width = stage.clientWidth;
      const height = stage.clientHeight;
      const radiusX = width * 0.31;
      const radiusY = height * 0.15;
      const elapsed = reduceMotion.matches ? 0 : (now - start) / 1000;

      itemRefs.current.forEach((item, index) => {
        if (!item) return;
        const angle = elapsed * 0.34 + (index / VAPES.length) * Math.PI * 2;
        const x = Math.cos(angle) * radiusX;
        const y = Math.sin(angle) * radiusY;
        const depth = (Math.sin(angle) + 1) / 2;
        const scale = 0.48 + depth * 0.58;
        const brightness = 0.42 + depth * 0.72;
        const opacity = 0.34 + depth * 0.66;
        const blur = (1 - depth) * 1.15;

        item.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale}) rotate(17deg)`;
        item.style.filter = `brightness(${brightness}) saturate(${0.72 + depth * 0.38}) blur(${blur}px) drop-shadow(0 ${8 + depth * 12}px ${8 + depth * 20}px rgba(255, 174, 0, ${0.06 + depth * 0.22}))`;
        item.style.opacity = String(opacity);
        item.style.zIndex = String(Math.round(depth * 100));
      });

      if (!reduceMotion.matches) frame = requestAnimationFrame(render);
    };

    const restart = () => {
      cancelAnimationFrame(frame);
      start = performance.now();
      frame = requestAnimationFrame(render);
    };
    reduceMotion.addEventListener("change", restart);
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      reduceMotion.removeEventListener("change", restart);
    };
  }, []);

  return (
    <div className="vape-orbit" ref={stageRef} aria-hidden="true">
      <div className="vape-orbit__halo" />
      {VAPES.map((src, index) => (
        <div
          className="vape-orbit__item"
          key={src}
          ref={(node) => {
            itemRefs.current[index] = node;
          }}
        >
          {/* Decorative generated assets with local, fixed dimensions. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" draggable={false} />
        </div>
      ))}
    </div>
  );
}
