"use client";

import { useRef } from "react";
import { gsap, MEDIA, useGSAP } from "@/lib/gsap";

/*
 * Cursor decorativo que segue o mouse. Nunca substitui o cursor nativo (não usamos cursor: none):
 * teclado e touch continuam com o comportamento padrão do sistema. Só existe com mouse de verdade
 * e movimento liberado. Elementos com data-cursor="Texto" transformam o círculo num rótulo.
 */
export function Cursor() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(`${MEDIA.motionOK} and ${MEDIA.finePointer}`, () => {
        const el = root.current!;
        const label = el.querySelector<HTMLElement>("[data-cursor-label]")!;
        const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });
        let current: Element | null = null;

        const onMove = (event: PointerEvent) => {
          if (event.pointerType !== "mouse") return;
          gsap.to(el, { autoAlpha: 1, duration: 0.2, overwrite: "auto" });
          xTo(event.clientX);
          yTo(event.clientY);

          const target = (event.target as Element | null)?.closest("[data-cursor]") ?? null;
          if (target === current) return;
          current = target;
          const text = target?.getAttribute("data-cursor") ?? "";
          if (text) label.textContent = text;
          gsap.to(el, { "--size": text ? "6rem" : "0.75rem", duration: 0.4, ease: "expo.out" });
          gsap.to(label, { autoAlpha: text ? 1 : 0, duration: 0.2 });
        };
        const onLeave = () => gsap.to(el, { autoAlpha: 0, duration: 0.2 });

        window.addEventListener("pointermove", onMove, { passive: true });
        document.documentElement.addEventListener("pointerleave", onLeave);
        return () => {
          window.removeEventListener("pointermove", onMove);
          document.documentElement.removeEventListener("pointerleave", onLeave);
        };
      });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[90] invisible opacity-0 [--size:0.75rem]"
    >
      <div className="flex size-(--size) -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-bone text-ink-950">
        <span data-cursor-label className="invisible font-mono text-[11px] tracking-[0.08em] whitespace-nowrap uppercase opacity-0" />
      </div>
    </div>
  );
}
