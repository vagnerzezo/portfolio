"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MEDIA, ScrollTrigger, useGSAP } from "@/lib/gsap";

/*
 * Linha do tempo: a linha lateral "desce" acompanhando o scroll (scrub) e cada item
 * [data-timeline-item] entra com stagger quando chega na tela (ScrollTrigger.batch agrupa
 * os que entram juntos). O ponto do cargo atual [data-timeline-dot] começa apagado e acende
 * quando a linha alcança a altura dele (mesmo "top 70%" do scrub). Com movimento reduzido nada
 * disso roda: o ponto já nasce aceso e os itens aparecem estáticos.
 */
export function TimelineReveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motionOK, () => {
        gsap.from("[data-timeline-line]", {
          scaleY: 0,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top 70%", end: "bottom 70%", scrub: true },
        });

        const items = gsap.utils.toArray<HTMLElement>("[data-timeline-item]");
        gsap.set(items, { autoAlpha: 0, y: 48 });
        ScrollTrigger.batch(items, {
          start: "top 85%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.15, ease: "expo.out" }),
        });

        const dots = gsap.utils.toArray<HTMLElement>("[data-timeline-dot]");
        dots.forEach((dot) => {
          dot.classList.add("is-dim");
          ScrollTrigger.create({
            trigger: dot,
            start: "top 70%",
            onEnter: () => dot.classList.remove("is-dim"),
            onLeaveBack: () => dot.classList.add("is-dim"),
          });
        });
        // Limpeza do matchMedia: se o usuário ativar movimento reduzido, o ponto volta aceso.
        return () => dots.forEach((dot) => dot.classList.remove("is-dim"));
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className={`relative ${className}`}>
      <div aria-hidden="true" className="absolute top-0 bottom-0 left-0 w-px bg-line">
        <div data-timeline-line className="h-full w-full origin-top bg-accent" />
      </div>
      {children}
    </div>
  );
}
