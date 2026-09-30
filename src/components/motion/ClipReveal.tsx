"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MEDIA, useGSAP } from "@/lib/gsap";

/** Revela o conteúdo (uma imagem) de baixo para cima com clip-path ao entrar na tela. */
export function ClipReveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motionOK, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: "top 85%", once: true } })
          .from(root.current, { clipPath: "inset(100% 0% 0% 0%)", duration: 1.4, ease: "expo.out" })
          .from(root.current!.firstElementChild, { scale: 1.2, duration: 1.8, ease: "expo.out" }, 0);
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className={`overflow-hidden [clip-path:inset(0%_0%_0%_0%)] ${className}`}>
      {children}
    </div>
  );
}
