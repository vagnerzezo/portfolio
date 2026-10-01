import type { CSSProperties } from "react";
import { TimelineReveal } from "@/components/motion/TimelineReveal";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TagList } from "@/components/ui/Tag";
import { experience } from "@/content/experience";
import { site } from "@/content/site";

/*
 * Layout em duas colunas no desktop: à esquerda o rótulo, o título display e o link do currículo
 * (coluna sticky, acompanha a pilha de cargos em vez de sumir e deixar um vão); à direita a linha
 * do tempo, cada cargo numa grade data | texto | tags.
 * No mobile tudo empilha e as tags descem para baixo da descrição.
 *
 * Efeito "pilha" (md+, só sem movimento reduzido): cada cargo é `sticky` com um `top` que cresce
 * pelo índice (--stack-index), então ao rolar o próximo cargo desliza por cima do anterior e deixa
 * à mostra só o cabeçalho dele (data, cargo e empresa). O empilhamento é CSS puro: o navegador calcula
 * o sticky na thread de composição e o componente continua Server Component. O fundo opaco
 * esconde a descrição do cargo coberto; a divisória vai no topo de cada item para continuar
 * visível entre os cabeçalhos empilhados.
 * O último item não tem onde grudar (é o fim da lista); o TimelineReveal "congela" a pilha quando
 * ele chega no lugar dele, para os três saírem juntos em vez de o último cobrir os outros.
 * A divisória de baixo fica no último item (last:border-b).
 *
 * No mobile o título "Onde já trabalhei" fica sticky logo abaixo do header (4.5rem) e os cargos grudam
 * logo abaixo dele: 4.5rem + 6.75rem do bloco do título (h2 no mínimo do clamp, 3rem) = 11.25rem.
 * Se o bloco do título mudar de altura, ajuste esse top. O efeito é "cobrir": todos os cargos grudam no mesmo top fixo e o
 * próximo desliza por cima do anterior. Cards mais altos que a tela têm o fim da descrição coberto
 * antes de aparecer (decisão de design: top fixo em vez de top calculado pela altura).
 */
export function Experience() {
  return (
    <section id="experiencia" aria-labelledby="experiencia-title" className="scroll-mt-20 py-28 md:py-40">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div
          data-timeline-title
          className="grid content-start gap-8 max-md:sticky max-md:top-18 max-md:z-10 max-md:-mb-12 max-md:gap-4 max-md:bg-ink-900 max-md:py-4 lg:sticky lg:top-[7.5rem] lg:col-span-3 lg:flex lg:flex-col lg:self-start"
        >
          <div className="grid gap-8 max-md:gap-3">
            <SectionLabel index={4}>Experiência</SectionLabel>
            <h2
              id="experiencia-title"
              className="font-display text-[clamp(3rem,6vw,5rem)] leading-[0.95] tracking-[-0.02em]"
            >
              Onde já <em>trabalhei</em>
            </h2>
          </div>
          {site.resumeUrl ? (
            <ArrowLink
              href={site.resumeUrl}
              external
              className="self-start border-b border-bone font-mono text-xs tracking-[0.08em] uppercase hover:no-underline"
            >
              Currículo completo
            </ArrowLink>
          ) : null}
        </div>

        <TimelineReveal className="lg:col-span-9">
          <ol className="grid">
            {experience.map((job, index) => {
              const current = job.end === null;
              return (
                <li
                  key={`${job.company}-${job.start}-${job.role}`}
                  data-timeline-item
                  style={{ "--stack-index": index } as CSSProperties}
                  className="group relative grid content-start gap-4 border-t border-line last:border-b bg-ink-900 py-4 pl-4 max-md:top-[11.25rem] md:top-[calc(5.5rem+var(--stack-index)*9rem)] md:grid-cols-[7rem_1fr_auto] md:gap-x-8 md:py-8 motion-safe:sticky"
                >
                  {/* Trilho da linha do tempo por cargo: com a pilha, uma linha única no <ol> apareceria
                      acima do primeiro cargo preso; dentro de cada item ela acompanha o card. */}
                  <span aria-hidden="true" className="absolute inset-y-0 left-0 w-px bg-line">
                    <span data-timeline-line className="block h-full w-full origin-top bg-accent" />
                  </span>
                  <div className="grid content-start gap-2 font-mono text-xs tracking-[0.08em] text-muted md:row-span-2">
                    <p>
                      {job.start} — {job.end ?? "Atual"}
                    </p>
                    {current ? (
                      <p className="flex items-center gap-2 text-accent-text uppercase">
                        <span
                          aria-hidden="true"
                          data-timeline-dot
                          className="size-1.5 rounded-full bg-accent transition-colors duration-500 [&.is-dim]:bg-faded"
                        />
                        Atual
                      </p>
                    ) : null}
                  </div>

                  <h3 className="font-display text-3xl leading-tight transition-transform duration-500 ease-out group-hover:translate-x-2 motion-reduce:transition-none md:text-4xl">
                    {job.role}
                    <br></br>
                    <span className="text-muted"> {job.company}</span>
                  </h3>

                  <TagList
                    tags={job.tags}
                    className="order-last content-start *:transition-colors group-hover:*:border-accent-text group-hover:*:text-accent-text md:order-none md:justify-end"
                  />

                  {/* Descrição ocupa da coluna do título até o fim da linha, passando por baixo das tags. */}
                  <p className="leading-relaxed text-bone-dim md:col-span-2 text-sm">{job.description}</p>
                </li>
              );
            })}
          </ol>
        </TimelineReveal>
      </div>
    </section>
  );
}
