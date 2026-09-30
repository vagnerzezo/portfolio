/*
 * Sinal "o preloader terminou". O hero só anima as letras depois disso; sem preloader
 * (movimento reduzido ou visita sem JS), o sinal é disparado na hora.
 * Um módulo simples basta: é um evento que acontece uma vez por carregamento de página.
 */
let done = false;
const listeners = new Set<() => void>();

export function markIntroDone() {
  if (done) return;
  done = true;
  listeners.forEach((listener) => listener());
  listeners.clear();
}

/** Executa `callback` quando a intro terminar (na hora, se já terminou). Retorna o cancelamento. */
export function onIntroDone(callback: () => void) {
  if (done) {
    callback();
    return () => {};
  }
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}
