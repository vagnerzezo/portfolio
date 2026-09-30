import { WordmarkLantern } from "@/components/motion/WordmarkLantern";
import { site } from "@/content/site";

/*
 * Efeito cortina: o footer é sticky no fundo da viewport e fica atrás do <main> (z-index menor).
 * Ao chegar no fim da página, o main sobe e o footer aparece "por baixo", sem nenhum JS.
 */
export function Footer() {
  // Página estática: o ano é o do build. Um deploy por ano já basta para manter atualizado.
  const year = new Date().getFullYear();

  return (
    <footer className="sticky bottom-0 z-0 bg-ink-950">
      <div className="shell grid gap-16 pt-24 pb-10">
        <WordmarkLantern />
        <div className="flex flex-col gap-4 font-mono text-xs tracking-[0.08em] text-muted uppercase sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name.first} {site.name.last}
          </p>
          <a href="#inicio" className="inline-flex min-h-11 items-center gap-2 text-bone-dim hover:text-bone">
            Voltar ao topo <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
