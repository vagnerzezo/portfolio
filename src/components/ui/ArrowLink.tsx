import type { ComponentPropsWithoutRef } from "react";

type ArrowLinkProps = ComponentPropsWithoutRef<"a"> & { external?: boolean };

/** Link com seta ↗. Externos abrem em nova aba e avisam isso ao leitor de tela. */
export function ArrowLink({ external = false, children, className = "", ...props }: ArrowLinkProps) {
  return (
    <a
      {...props}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`group inline-flex min-h-11 items-center gap-2 underline-offset-4 hover:underline ${className}`}
    >
      {children}
      <span
        aria-hidden="true"
        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
      >
        ↗
      </span>
      {external ? <span className="sr-only"> (abre em nova aba)</span> : null}
    </a>
  );
}
