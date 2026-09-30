"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MEDIA, ScrollTrigger, useGSAP } from "@/lib/gsap";

type HorizontalPinProps = {
  total: number;
  header: ReactNode;
  /** Os <li> dos cards. */
  children: ReactNode;
};

/*
 * Desktop + movimento liberado: a seção fica fixa (pin) e o scroll vertical move os cards na
 * horizontal. O layout horizontal só é ligado pelo JS (data-horizontal): no HTML do servidor,
 * no mobile e com movimento reduzido os cards ficam empilhados em grid, sem nada escondido.
 */
export function HorizontalPin({ total, header, children }: HorizontalPinProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(`${MEDIA.desktop} and ${MEDIA.motionOK}`, () => {
        const el = root.current!;
        const track = el.querySelector<HTMLElement>("[data-track]")!;
        const viewport = el.querySelector<HTMLElement>("[data-viewport]")!;
        const counter = el.querySelector<HTMLElement>("[data-counter]")!;
        const bar = el.querySelector<HTMLElement>("[data-progress]")!;
        el.dataset.horizontal = "true";

        // Largura útil = área do conteúdo do container (sem o padding lateral do .shell).
        const distance = () => {
          const style = getComputedStyle(viewport);
          const inner = viewport.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
          return Math.max(0, track.scrollWidth - inner);
        };

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: el,
            pin: true,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const current = Math.min(total, Math.floor(self.progress * total) + 1);
              counter.textContent = String(current).padStart(2, "0");
              gsap.set(bar, { scaleX: self.progress });
            },
          },
        });

        /*
         * Acessibilidade: um card fora da tela (deslocado por transform) não é trazido à vista
         * pelo navegador ao receber foco. Então, no Tab, rolamos até o ponto do scroll em que
         * aquele card aparece.
         */
        const cards = Array.from(track.children);
        const onFocus = (event: FocusEvent) => {
          const st = tween.scrollTrigger as ScrollTrigger;
          const card = cards.findIndex((item) => item.contains(event.target as Node));
          if (card < 0 || total < 2) return;
          // Card já inteiro na tela (ex.: foco devolvido ao fechar o modal do case): não mexe no scroll.
          const rect = cards[card].getBoundingClientRect();
          if (rect.left >= 0 && rect.right <= window.innerWidth) return;
          st.scroll(st.start + ((st.end - st.start) * card) / (total - 1));
        };
        track.addEventListener("focusin", onFocus);

        return () => {
          track.removeEventListener("focusin", onFocus);
          delete el.dataset.horizontal;
        };
      });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className="group flex flex-col gap-12 py-28 md:py-40 data-horizontal:h-dvh data-horizontal:justify-center data-horizontal:gap-10 data-horizontal:py-0"
    >
      <div className="shell flex items-end justify-between gap-6">
        {header}
        {/* Contador e barra só existem no modo horizontal (no grid empilhado não fazem sentido). */}
        <div aria-hidden="true" className="hidden w-56 gap-4 pb-2 group-data-horizontal:grid">
          <p className="justify-self-end font-mono text-2xl text-faded tabular-nums">
            <span data-counter className="text-bone">
              01
            </span>{" "}
            / {String(total).padStart(2, "0")}
          </p>
          <div className="h-px bg-line">
            <div data-progress className="h-full origin-left scale-x-0 bg-accent" />
          </div>
        </div>
      </div>

      <div data-viewport className="shell group-data-horizontal:overflow-hidden">
        <ul
          data-track
          className="grid gap-12 md:grid-cols-2 md:gap-x-8 md:gap-y-16 group-data-horizontal:flex group-data-horizontal:w-max group-data-horizontal:gap-8"
        >
          {children}
        </ul>
      </div>
    </div>
  );
}
