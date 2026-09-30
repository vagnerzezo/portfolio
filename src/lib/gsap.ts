"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/*
 * Ponto único de registro dos plugins. Componentes importam daqui (nunca de "gsap" direto),
 * assim é impossível usar ScrollTrigger/SplitText sem que estejam registrados.
 */
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

/** Condições do gsap.matchMedia(). Toda animação fica dentro de `motionOK`. */
export const MEDIA = {
  motionOK: "(prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 1024px)",
  finePointer: "(hover: hover) and (pointer: fine)",
} as const;

export { gsap, ScrollTrigger, SplitText, useGSAP };
