"use client";

import { useRef, type ReactNode } from "react";
import { onIntroDone } from "@/lib/intro";
import { gsap, MEDIA, SplitText, useGSAP } from "@/lib/gsap";

/*
 * Letras sobem por máscara, em stagger, quando o preloader termina.
 * O split acontece só na hora de animar (fontes já carregadas → linhas medidas certo) e com
 * autoSplit: se a largura mudar, o SplitText refaz as linhas e mantém o progresso da animação.
 */
export function SplitReveal({ children, className }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const mm = gsap.matchMedia();

      mm.add(MEDIA.motionOK, () => {
        // Não escondemos o título antes da intro: o preloader já o cobre, e deixá-lo pintado desde
        // o primeiro frame mantém o LCP no carregamento (e não no fim da animação).
        const target = root.current!.firstElementChild as HTMLElement;

        // contextSafe: a animação criada depois (no fim do preloader) também é limpa no unmount.
        const play = contextSafe!(() => {
          SplitText.create(target, {
            type: "lines,chars",
            mask: "lines",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.chars, { yPercent: 115, duration: 1.2, stagger: 0.045, ease: "expo.out" }),
          });
        });

        return onIntroDone(play);
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
