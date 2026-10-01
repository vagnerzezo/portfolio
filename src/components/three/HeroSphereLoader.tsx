"use client";

import dynamic from "next/dynamic";
import { useRef, useState, type ReactNode } from "react";
import { MEDIA } from "@/lib/gsap";
import { useMediaQuery } from "@/lib/use-media-query";

/*
 * Three.js (~150 kB gz com R3F) só é baixado com movimento liberado, em qualquer tela.
 * Abaixo de 1024px roda em modo `compact` (menos partículas, DPR menor) para caber na GPU do celular.
 * `ssr: false` porque WebGL não existe no servidor. Até o canvas ficar pronto (e com movimento
 * reduzido) quem aparece é o fallback SVG vindo do servidor.
 *
 * O canvas cobre o hero inteiro para as partículas poderem se espalhar sem serem cortadas
 * por um quadrado; o quadrado (`anchorClassName`) só define onde a esfera fica e o tamanho dela.
 */
const HeroSphere = dynamic(() => import("./HeroSphere"), { ssr: false });

export function HeroSphereLoader({
  fallback,
  triggerId,
  anchorClassName,
}: {
  fallback: ReactNode;
  triggerId: string;
  anchorClassName: string;
}) {
  const anchor = useRef<HTMLDivElement>(null);
  const enabled = useMediaQuery(MEDIA.motionOK);
  const desktop = useMediaQuery(MEDIA.desktop);
  const [ready, setReady] = useState(false);
  const showCanvas = enabled && ready;

  return (
    <div className="relative size-full">
      <div
        ref={anchor}
        className={`${anchorClassName} transition-opacity duration-700 ${showCanvas ? "opacity-0" : "opacity-100"}`}
      >
        {fallback}
      </div>
      {enabled ? (
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${showCanvas ? "opacity-100" : "opacity-0"}`}
        >
          <HeroSphere
            triggerId={triggerId}
            anchor={anchor}
            compact={!desktop}
            onReady={() => setReady(true)}
          />
        </div>
      ) : null}
    </div>
  );
}
