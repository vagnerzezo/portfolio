"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MEDIA, ScrollTrigger, useGSAP } from "@/lib/gsap";

/*
 * Linha do tempo: cada item tem seu trecho de linha lateral [data-timeline-line] (fica dentro do
 * item porque os itens são sticky e empilham) e ele "desce" acompanhando o scroll (scrub). Cada item
 * [data-timeline-item] entra com stagger quando chega na tela (ScrollTrigger.batch agrupa
 * os que entram juntos). O ponto do cargo atual [data-timeline-dot] começa apagado e acende
 * quando a linha alcança a altura dele (mesmo "top 70%" do scrub). Com movimento reduzido nada
 * disso roda: o ponto já nasce aceso e os itens aparecem estáticos.
 *
 * Saída da pilha: os itens são sticky (CSS), mas o último não tem onde grudar (é o fim da lista),
 * então seguiria subindo por cima dos cabeçalhos anteriores. Quando ele chega no lugar dele na
 * pilha (o próprio `top` do CSS), os anteriores deixam de ser sticky e viram `relative` com um
 * `top` que os mantém exatamente onde estavam: dali em diante a pilha rola junta, como um bloco.
 * Ao voltar o scroll, o sticky é restaurado. Só roda quando o sticky está ativo (md+).
 */
export function TimelineReveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motionOK, () => {
        gsap.utils.toArray<HTMLElement>("[data-timeline-line]").forEach((line) => {
          gsap.from(line, {
            scaleY: 0,
            ease: "none",
            scrollTrigger: { trigger: line.parentElement, start: "top 70%", end: "bottom 70%", scrub: true },
          });
        });

        const items = gsap.utils.toArray<HTMLElement>("[data-timeline-item]");
        gsap.set(items, { autoAlpha: 0, y: 48 });
        ScrollTrigger.batch(items, {
          start: "top 85%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.15, ease: "expo.out" }),
        });

        const releaseStack = createStackRelease(items);

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
        return () => {
          dots.forEach((dot) => dot.classList.remove("is-dim"));
          releaseStack?.();
        };
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

/*
 * Congela a pilha quando o último item chega na posição dele. Retorna a limpeza, ou undefined
 * quando não há pilha (um item só, ou sticky desligado no mobile).
 */
function createStackRelease(items: HTMLElement[]) {
  const last = items.at(-1);
  const stacked = items.slice(0, -1);
  if (!last || stacked.length === 0 || getComputedStyle(last).position !== "sticky") return;

  // `top` de cada item vem do CSS (5.5rem + índice × 9rem). Lido antes de qualquer estilo inline.
  const cssTop = (el: HTMLElement) => parseFloat(getComputedStyle(el).top);
  let released = false;

  const release = () => {
    if (released) return;
    released = true;
    // Posições pelo layout (offsetTop), não por getBoundingClientRect: a entrada dos itens anima
    // `y` e isso distorceria a medida. Cada item anterior fica a (top do último − top dele) acima
    // do último, exatamente como estava na pilha.
    const lastTop = cssTop(last);
    const gaps = stacked.map((el) => lastTop - cssTop(el));
    stacked.forEach((el) => {
      el.style.position = "relative";
      el.style.top = "0px";
    });
    stacked.forEach((el, i) => {
      el.style.top = `${last.offsetTop - gaps[i] - el.offsetTop}px`;
    });
  };

  const restore = () => {
    if (!released) return;
    released = false;
    stacked.forEach((el) => {
      el.style.position = "";
      el.style.top = "";
    });
  };

  const trigger = ScrollTrigger.create({
    trigger: last,
    // Soma o `y` da animação de entrada, que ainda pode estar aplicado quando o refresh mede.
    start: () => `top ${cssTop(last) + Number(gsap.getProperty(last, "y"))}px`,
    end: "max",
    onEnter: release,
    onLeaveBack: restore,
  });
  // No refresh (resize, fontes) as medidas precisam do layout original; depois reaplica se já passou.
  const onRefreshInit = () => restore();
  const onRefresh = () => {
    if (trigger.progress > 0) release();
  };
  ScrollTrigger.addEventListener("refreshInit", onRefreshInit);
  ScrollTrigger.addEventListener("refresh", onRefresh);

  return () => {
    ScrollTrigger.removeEventListener("refreshInit", onRefreshInit);
    ScrollTrigger.removeEventListener("refresh", onRefresh);
    restore();
  };
}
