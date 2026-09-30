"use client";

import { useEffect, useRef, type ReactNode } from "react";

/*
 * Some ao rolar para baixo e volta ao rolar para cima. Estado vive em data-atributos no DOM
 * (não em useState): o scroll dispara dezenas de vezes por segundo e não há motivo para
 * re-renderizar o React a cada evento. Com foco dentro (teclado), o header sempre aparece.
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = ref.current!;
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      header.dataset.scrolled = String(y > 24);
      if (Math.abs(y - lastY) > 4) {
        header.dataset.hidden = String(y > lastY && y > 160);
        lastY = y;
      }
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
      className="fixed inset-x-0 top-0 z-50 border-b border-transparent transition-[translate,background-color,border-color] duration-500 ease-out focus-within:translate-y-0! data-[hidden=true]:-translate-y-full data-[scrolled=true]:border-line data-[scrolled=true]:bg-ink-900/85 data-[scrolled=true]:backdrop-blur-md motion-reduce:transition-none"
    >
      {children}
    </header>
  );
}
