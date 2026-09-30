"use client";

import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import { gsap, MEDIA, useGSAP } from "@/lib/gsap";

const WIDTH = 8675;
const HEIGHT = 1324;
/** Raio da lanterna em relação à altura da assinatura. */
const RADIUS_RATIO = 0.65;

/*
 * "Lanterna" da assinatura do footer: duas camadas do mesmo desenho, contorno por baixo e a
 * versão preenchida por cima, recortada por clip-path: circle(). Posição (--x, --y) e raio (--r)
 * são variáveis CSS animadas com gsap.quickTo, então o círculo segue o cursor com inércia e
 * o mesmo trio de variáveis move o anel tracejado.
 *
 * Só desktop com mouse e movimento liberado. Fora disso nada é ligado e --r fica 0: a camada
 * preenchida continua invisível (o valor inicial vem no style, antes mesmo da hidratação).
 */
export function WordmarkLantern() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MEDIA.desktop} and ${MEDIA.finePointer} and ${MEDIA.motionOK}`, () => {
        const el = root.current!;
        const xTo = gsap.quickTo(el, "--x", { duration: 0.5, ease: "power3.out" });
        const yTo = gsap.quickTo(el, "--y", { duration: 0.5, ease: "power3.out" });
        const rTo = gsap.quickTo(el, "--r", { duration: 0.6, ease: "power3.out" });

        const local = (event: PointerEvent) => {
          const rect = el.getBoundingClientRect();
          return { x: event.clientX - rect.left, y: event.clientY - rect.top, height: rect.height };
        };

        // Ao entrar, o círculo nasce no ponto do cursor (sem "voar" da última posição) e cresce.
        const onEnter = (event: PointerEvent) => {
          const { x, y, height } = local(event);
          gsap.set(el, { "--x": x, "--y": y });
          xTo(x, x);
          yTo(y, y);
          rTo(height * RADIUS_RATIO);
        };
        const onMove = (event: PointerEvent) => {
          const { x, y } = local(event);
          xTo(x);
          yTo(y);
        };
        const onLeave = () => rTo(0);

        el.addEventListener("pointerenter", onEnter);
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);
        return () => {
          el.removeEventListener("pointerenter", onEnter);
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", onLeave);
          gsap.set(el, { "--r": 0 });
        };
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative" style={{ "--x": 0, "--y": 0, "--r": 0 } as CSSProperties}>
      {/* alt vazio: o nome já está escrito logo abaixo, no copyright. SVG vai sem otimização
          (o next/image faz isso sozinho para .svg). */}
      <Image
        src="/images/vagnerzezo-traco-branco.svg"
        alt=""
        width={WIDTH}
        height={HEIGHT}
        sizes="(min-width: 1440px) 1440px, 100vw"
        className="h-auto w-full"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [clip-path:circle(calc(var(--r)*1px)_at_calc(var(--x)*1px)_calc(var(--y)*1px))]"
      >
        <Image
          src="/images/vagnerzezo-preenchido.svg"
          alt=""
          width={WIDTH}
          height={HEIGHT}
          sizes="(min-width: 1440px) 1440px, 100vw"
          className="h-auto w-full"
        />
      </div>
      {/* Anel tracejado na borda da lanterna. Com --r = 0 a opacidade vai a 0 (sem pontinho da borda). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[calc(var(--y)*1px)] left-[calc(var(--x)*1px)] size-[calc(var(--r)*2px)] -translate-1/2 rounded-full border border-dashed border-muted/60 [opacity:clamp(0,var(--r),1)]"
      />
    </div>
  );
}
