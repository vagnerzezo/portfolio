import { TimelineReveal } from "@/components/motion/TimelineReveal";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TagList } from "@/components/ui/Tag";
import { experience } from "@/content/experience";
import { site } from "@/content/site";

/*
 * Layout em duas colunas no desktop: à esquerda o rótulo, o título display e o link do currículo
 * (preso no pé da coluna); à direita a linha do tempo, cada cargo numa grade data | texto | tags.
 * No mobile tudo empilha e as tags descem para baixo da descrição.
 */
export function Experience() {
  return (
    <section id="experiencia" aria-labelledby="experiencia-title" className="scroll-mt-20 py-28 md:py-40">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="grid content-start gap-8 lg:col-span-3 lg:flex lg:flex-col lg:justify-between">
          <div className="grid gap-8">
            <SectionLabel index={4}>Experiência</SectionLabel>
            <h2
              id="experiencia-title"
              className="font-display text-[clamp(3rem,6vw,5rem)] leading-[0.95] tracking-[-0.02em]"
            >
              Onde já <em>trabalhei</em>
            </h2>
          </div>
          <ArrowLink
            href={site.resumeUrl}
            external
            className="self-start border-b border-bone font-mono text-xs tracking-[0.08em] uppercase hover:no-underline"
          >
            Currículo completo
          </ArrowLink>
        </div>

        <TimelineReveal className="lg:col-span-9">
          <ol className="grid border-t border-line">
            {experience.map((job) => {
              const current = job.end === null;
              return (
                <li
                  key={`${job.company}-${job.start}-${job.role}`}
                  data-timeline-item
                  className="group grid gap-4 border-b border-line py-4 pl-4 md:grid-cols-[7rem_1fr_auto] md:gap-x-8 md:py-8"
                >
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
