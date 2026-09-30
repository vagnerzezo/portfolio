import type { SVGProps } from "react";

/** Path oficial do VZ (viewBox 0 0 585 260). Reutilizado pelo <LogoDraw> animado. */
export const LOGO_PATH =
  "M0 0H110L174 121L235 0H585L440 200H585V260H294L434 60H310L210 260H140Z";

type LogoProps = Omit<SVGProps<SVGSVGElement>, "viewBox" | "children"> & {
  /** Texto acessível. Sem ele, o logo é decorativo (aria-hidden). */
  title?: string;
};

export function Logo({ title, ...props }: LogoProps) {
  return (
    <svg
      viewBox="0 0 585 260"
      fill="none"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      overflow="visible"
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <path
        d={LOGO_PATH}
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinejoin="miter"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
