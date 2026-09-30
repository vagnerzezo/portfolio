import { useId } from "react";
import { LOGO_PATH } from "@/components/ui/Logo";

/*
 * Logo em contorno pronto para ser "desenhado": pathLength={1} normaliza o comprimento do traço,
 * então stroke-dashoffset de 1 → 0 desenha o path inteiro, independente do tamanho real.
 *
 * Por dentro, um preenchimento "sobe" como líquido: o path preenchido é recortado (clipPath)
 * por um retângulo que começa abaixo do logo (y = 260) e sobe até y = 0. O contorno fica por
 * cima do preenchimento. Não anima sozinho: quem usa (o Preloader) controla o tempo com GSAP
 * via [data-logo-draw] e [data-logo-fill].
 */
export function LogoDraw({ className = "" }: { className?: string }) {
  // useId pode trazer caracteres como ":" ou "«»"; limpamos para o url(#id) funcionar em qualquer navegador.
  const clipId = `logo-fill-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  return (
    <svg viewBox="0 0 585 260" fill="none" aria-hidden="true" overflow="visible" className={className}>
      <defs>
        <clipPath id={clipId}>
          <rect data-logo-fill x="0" y="260" width="585" height="260" />
        </clipPath>
      </defs>
      <path d={LOGO_PATH} clipPath={`url(#${clipId})`} className="fill-faded" />
      <path
        data-logo-draw
        d={LOGO_PATH}
        pathLength={1}
        stroke="currentColor"
        strokeWidth={1.5}
        strokeDasharray={1}
        strokeDashoffset={1}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
