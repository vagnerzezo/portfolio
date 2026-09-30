/*
 * Rate limit por IP em memória (janela deslizante).
 *
 * TODO(produção): na Vercel cada invocação serverless pode rodar numa instância nova, então
 * este Map não é compartilhado nem persiste — o limite vale só "por instância quente".
 * Para um limite real, trocar por Upstash Redis:
 *   pnpm add @upstash/ratelimit @upstash/redis
 *   const ratelimit = new Ratelimit({ redis: Redis.fromEnv(), limiter: Ratelimit.slidingWindow(5, "10 m") })
 *   const { success } = await ratelimit.limit(ip)
 * A assinatura de `rateLimit()` abaixo já é async para a troca não mudar quem chama.
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

const hits = new Map<string, number[]>();

export async function rateLimit(key: string): Promise<{ success: boolean }> {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS) {
    hits.set(key, recent);
    return { success: false };
  }

  recent.push(now);
  hits.set(key, recent);
  return { success: true };
}
