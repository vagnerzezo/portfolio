"use client";

import { useEffect, useRef, type ReactNode } from "react";

/*
 * Header fixo e sempre visível; ao sair do topo ganha fundo e borda. Estado vive em data-atributos
 * no DOM (não em useState): o scroll dispara dezenas de vezes por segundo e não há motivo para
 * re-renderizar o React a cada evento.
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = ref.current!;
    let frame = 0;

    const update = () => {
      frame = 0;
      header.dataset.scrolled = String(window.scrollY > 24);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header
      ref={ref}
      className="fixed inset-x-0 top-0 z-50 border-b border-transparent transition-[background-color,border-color] duration-500 ease-out data-[scrolled=true]:border-line data-[scrolled=true]:bg-ink-900/85 data-[scrolled=true]:backdrop-blur-md motion-reduce:transition-none"
    >
      {children}
    </header>
  );
}
