"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MEDIA, ScrollTrigger, useGSAP } from "@/lib/gsap";

/*
 * Itens [data-reveal-item] sobem com leve stagger quando entram na tela. Mesmo padrão do
 * TimelineReveal (ScrollTrigger.batch + once), sem a linha lateral. Com movimento reduzido
 * nada é escondido: os itens já nascem visíveis.
 */
export function StaggerReveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motionOK, () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-reveal-item]");
        gsap.set(items, { autoAlpha: 0, y: 32 });
        ScrollTrigger.batch(items, {
          start: "top 85%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12, ease: "expo.out" }),
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
