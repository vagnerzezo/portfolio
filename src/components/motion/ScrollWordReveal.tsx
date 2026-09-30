"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MEDIA, SplitText, useGSAP } from "@/lib/gsap";

const FADED = "#6b675f"; // --color-faded: GSAP precisa da cor literal para interpolar.

/*
 * Cada palavra começa "apagada" e ganha sua cor final (bone, ou accent-text no trecho em itálico)
 * conforme o scroll. gsap.from() anima até a cor computada de cada palavra, então o destaque
 * do conteúdo é preservado sem configuração extra.
 */
export function ScrollWordReveal({ children, className }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motionOK, () => {
        const split = SplitText.create(root.current!, {
          type: "words",
          // Palavras inteiras continuam legíveis para leitor de tela; aria-label num <p> é inválido.
          aria: "none",
        });
        gsap.from(split.words, {
          color: FADED,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top 80%", end: "bottom 45%", scrub: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <p ref={root} className={className}>
      {children}
    </p>
  );
}
