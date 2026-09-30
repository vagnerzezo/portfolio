"use client";

import dynamic from "next/dynamic";
import { useState, type ReactNode } from "react";
import { MEDIA } from "@/lib/gsap";
import { useMediaQuery } from "@/lib/use-media-query";

/*
 * Three.js (~150 kB gz com R3F) só é baixado quando vale a pena: tela ≥ 1024px e movimento
 * liberado. `ssr: false` porque WebGL não existe no servidor. Até o canvas ficar pronto
 * (e em todos os outros casos) quem aparece é o fallback SVG vindo do servidor.
 */
const HeroSphere = dynamic(() => import("./HeroSphere"), { ssr: false });

export function HeroSphereLoader({ fallback, triggerId }: { fallback: ReactNode; triggerId: string }) {
  const enabled = useMediaQuery(`${MEDIA.desktop} and ${MEDIA.motionOK}`);
  const [ready, setReady] = useState(false);
  const showCanvas = enabled && ready;

  return (
    <div className="relative size-full">
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${showCanvas ? "opacity-0" : "opacity-100"}`}
      >
        {fallback}
      </div>
      {enabled ? (
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${showCanvas ? "opacity-100" : "opacity-0"}`}
        >
          <HeroSphere triggerId={triggerId} onReady={() => setReady(true)} />
        </div>
      ) : null}
    </div>
  );
}
