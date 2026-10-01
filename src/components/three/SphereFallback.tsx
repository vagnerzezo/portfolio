/*
 * Esfera estática em SVG: pontos de uma esfera de Fibonacci projetados em 2D, calculados no
 * servidor (determinístico, zero JS no client). É o que aparece com movimento reduzido e
 * enquanto o Three.js carrega.
 */
const POINTS = 520;
const RADIUS = 240;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

const dots = Array.from({ length: POINTS }, (_, i) => {
  const y = 1 - (i / (POINTS - 1)) * 2;
  const r = Math.sqrt(1 - y * y);
  const theta = GOLDEN_ANGLE * i;
  const x = Math.cos(theta) * r;
  const z = Math.sin(theta) * r;
  // Inclina a esfera para os polos não ficarem de frente.
  const tilt = 0.45;
  const yy = y * Math.cos(tilt) - z * Math.sin(tilt);
  const zz = y * Math.sin(tilt) + z * Math.cos(tilt);
  const depth = (zz + 1) / 2;
  return {
    cx: +(x * RADIUS).toFixed(2),
    cy: +(yy * RADIUS).toFixed(2),
    r: +(0.8 + depth * 1.6).toFixed(2),
    opacity: +(0.12 + depth * 0.7).toFixed(2),
  };
});

export function SphereFallback({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="-260 -260 520 520" aria-hidden="true" className={`text-bone ${className}`}>
      {dots.map((dot, i) => (
        <circle key={i} {...dot} fill="currentColor" />
      ))}
    </svg>
  );
}
