"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/*
 * Ponto único de registro dos plugins. Componentes importam daqui (nunca de "gsap" direto),
 * assim é impossível usar ScrollTrigger/SplitText sem que estejam registrados.
 */
gsap.registerPlugin(useGSAP, Flip, ScrollTrigger, SplitText);

/** Condições do gsap.matchMedia(). Toda animação fica dentro de `motionOK`. */
export const MEDIA = {
  motionOK: "(prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 1024px)",
  // Mesmos limites do breakpoint `md` do Tailwind (48rem).
  md: "(min-width: 768px)",
  belowMd: "(max-width: 767.98px)",
  finePointer: "(hover: hover) and (pointer: fine)",
} as const;

export { Flip, gsap, ScrollTrigger, SplitText, useGSAP };
