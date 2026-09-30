"use client";

import { useLenis } from "lenis/react";
import { useEffect, useRef } from "react";
import { markIntroDone } from "@/lib/intro";
import { gsap, MEDIA, useGSAP } from "@/lib/gsap";
import { LogoDraw } from "./LogoDraw";

/*
 * Overlay renderizado já no HTML do servidor (senão o conteúdo piscaria antes dele aparecer).
 * Fica escondido por CSS com movimento reduzido e, sem JavaScript, pelo <noscript> do layout:
 * nesses casos o conteúdo nunca fica bloqueado.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const active = useRef(true);
  const lenis = useLenis();
  const lenisRef = useRef(lenis);

  // O Lenis monta depois da hidratação; se chegar com o preloader ainda na tela, fica parado.
  useEffect(() => {
    lenisRef.current = lenis;
    if (lenis && active.current) lenis.stop();
  }, [lenis]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MEDIA.motionOK, () => {
        const html = document.documentElement;
        const counter = { value: 0 };
        const output = root.current!.querySelector<HTMLElement>("[data-preloader-count]")!;
        html.style.overflow = "hidden";

        const finish = () => {
          active.current = false;
          html.style.overflow = "";
          gsap.set(root.current, { display: "none" });
          lenisRef.current?.start();
        };

        gsap
          .timeline({ defaults: { ease: "power2.inOut" }, onComplete: finish })
          .to(counter, {
            value: 100,
            duration: 1.6,
            onUpdate: () => {
              output.textContent = String(Math.round(counter.value));
            },
          })
          .to("[data-logo-draw]", { strokeDashoffset: 0, duration: 1.6 }, 0)
          // Mesma duração e ease do contador: o nível do "líquido" acompanha o 0 → 100.
          .to("[data-logo-fill]", { attr: { y: 0 }, duration: 1.6 }, 0)
          // A intro do hero começa junto com a cortina subindo, para as letras já estarem
          // escondidas na máscara quando o título aparecer.
          .add(markIntroDone, "+=0.15")
          .to(root.current, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.9, ease: "expo.inOut" }, "<");

        return () => {
          html.style.overflow = "";
        };
      });

      mm.add(MEDIA.reduced, () => {
        active.current = false;
        markIntroDone();
      });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      data-preloader
      aria-hidden="true"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-ink-950 text-bone [clip-path:inset(0%_0%_0%_0%)] motion-reduce:hidden"
    >
      <LogoDraw className="w-40 md:w-56" />
      <p className="font-mono text-sm tracking-[0.08em] text-muted tabular-nums">
        <span data-preloader-count>0</span>
      </p>
    </div>
  );
}
