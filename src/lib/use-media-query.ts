"use client";

import { useSyncExternalStore } from "react";

/**
 * Media query reativa. No servidor (e na hidratação) retorna `false`, então tudo que
 * depende dela (ex.: carregar Three.js) só acontece no client, sem mismatch de hidratação.
 */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
