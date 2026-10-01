"use client";

import { useRef } from "react";
import { gsap, MEDIA, ScrollTrigger, useGSAP } from "@/lib/gsap";

/*
 * Faixa infinita cuja velocidade e direção seguem o scroll. Em vez de um tween com repeat
 * (que trava ao rodar "de ré" a partir do zero), um loop no ticker soma deslocamento a cada
 * frame e dá a volta em -50% (a lista está duplicada, então -50% é igual a 0).
 */
export function VelocityMarquee({ items }: { items: string[] }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MEDIA.motionOK, () => {
        const inner = root.current!.querySelector<HTMLElement>("[data-marquee]")!;
        const wrap = gsap.utils.wrap(-50, 0);
        const setX = gsap.quickSetter(inner, "xPercent");
        const BASE_SPEED = 0.0012; // % por ms
        let x = 0;
        let direction = -1;
        let boost = 0;
        let visible = false;

        const trigger = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => (visible = self.isActive),
          onUpdate: (self) => {
            direction = self.direction === 1 ? -1 : 1;
            boost = gsap.utils.clamp(0, 8, Math.abs(self.getVelocity()) / 400);
          },
        });

        const tick = (_time: number, deltaMs: number) => {
          if (!visible) return;
          x = wrap(x + direction * BASE_SPEED * (1 + boost) * deltaMs);
          boost *= 0.93;
          setX(x);
        };
        gsap.ticker.add(tick);

        return () => {
          gsap.ticker.remove(tick);
          trigger.kill();
        };
      });
    },
    { scope: root },
  );

  const list = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className={`flex shrink-0 items-center motion-reduce:flex-wrap motion-reduce:justify-center ${hidden ? "motion-reduce:hidden" : ""}`}
    >
      {items.map((item) => (
        <li key={item} className="flex items-center">
          <span className="px-6 font-display text-5xl italic md:px-10 md:text-7xl">{item}</span>
          {/* SVG em vez do caractere ✳: no iOS ele vira emoji (quadrado verde) mesmo com cor no CSS. */}
          <svg
            aria-hidden="true"
            viewBox="-12 -12 24 24"
            className="size-7 shrink-0 text-accent md:size-11"
          >
            <path
              d="M0-10V10M-10 0H10M-7.07-7.07L7.07 7.07M-7.07 7.07L7.07-7.07"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>
        </li>
      ))}
    </ul>
  );

  return (
    <div ref={root} className="overflow-hidden">
      <div data-marquee className="flex w-max motion-reduce:w-full motion-reduce:flex-wrap">
        {list(false)}
        {list(true)}
      </div>
    </div>
  );
}
