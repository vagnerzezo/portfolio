"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MEDIA, useGSAP } from "@/lib/gsap";

/** O conteúdo (um botão) é "puxado" em direção ao mouse e volta com elástico ao sair. */
export function MagneticButton({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const root = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MEDIA.motionOK} and ${MEDIA.finePointer}`, () => {
        const el = root.current!;
        const xTo = gsap.quickTo(el, "x", { duration: 0.8, ease: "elastic.out(1, 0.4)" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.8, ease: "elastic.out(1, 0.4)" });

        const onMove = (event: PointerEvent) => {
          const rect = el.getBoundingClientRect();
          xTo((event.clientX - (rect.left + rect.width / 2)) * strength);
          yTo((event.clientY - (rect.top + rect.height / 2)) * strength);
        };
        const onLeave = () => {
          xTo(0);
          yTo(0);
        };

        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);
        return () => {
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", onLeave);
        };
      });
    },
    { scope: root },
  );

  return (
    <span ref={root} className="inline-block">
      {children}
    </span>
  );
}
