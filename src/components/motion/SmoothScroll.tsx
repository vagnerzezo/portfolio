"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect } from "react";
import { gsap, MEDIA, ScrollTrigger } from "@/lib/gsap";
import { useMediaQuery } from "@/lib/use-media-query";

/*
 * Lenis como instância global (root), renderizado como irmão do conteúdo e não como wrapper:
 * assim ligar/desligar o Lenis (ex.: usuário ativa "reduzir movimento") não remonta a página.
 * Só monta com movimento liberado; no servidor useMediaQuery é false, então o HTML inicial
 * é sempre scroll nativo.
 */
export function SmoothScroll() {
  const motionOK = useMediaQuery(MEDIA.motionOK);
  if (!motionOK) return null;

  return (
    <ReactLenis root options={{ lerp: 0.1, anchors: true, autoRaf: false }}>
      <GsapSync />
    </ReactLenis>
  );
}

/*
 * Um único relógio: o Lenis avança no ticker do GSAP (autoRaf: false) e avisa o ScrollTrigger
 * a cada scroll. Com dois requestAnimationFrame separados, pins e scrubs ficam um frame atrasados
 * em relação ao scroll e "tremem".
 */
function GsapSync() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const update = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(update);
      gsap.ticker.lagSmoothing(500, 33);
    };
  }, [lenis]);

  return null;
}
