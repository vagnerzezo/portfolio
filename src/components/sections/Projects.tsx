import Image from "next/image";
import { HorizontalPin } from "@/components/motion/HorizontalPin";
import { ProjectCase, ProjectOpenButton } from "@/components/projects/ProjectCase";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TagList } from "@/components/ui/Tag";
import { projects } from "@/content/projects";
import type { Project } from "@/types/content";

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const body = (
    <>
      <div data-flip-id={`case-${project.slug}`} className="overflow-hidden bg-ink-900">
        <Image
          src={project.image.src}
          alt={project.image.alt}
          width={project.image.width}
          height={project.image.height}
          sizes="(min-width: 1024px) 45vw, (min-width: 768px) 62vw, 100vw"
          className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-[1.03] motion-reduce:transition-none"
        />
      </div>
      {/* Mobile: número e contexto numa linha mono acima do nome, que fica com a largura toda e não
          quebra (nome em 2 linhas desalinhava o resto do card). md+: tudo na mesma linha. */}
      <div className="mt-6 grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-2 md:flex">
        <span className="font-mono text-sm text-muted tabular-nums">{String(index + 1).padStart(2, "0")}</span>
        <h3 className="col-span-2 row-start-2 truncate font-display text-3xl md:overflow-visible md:text-4xl md:whitespace-normal">
          {project.name}
        </h3>
        <span className="col-start-2 row-start-1 shrink-0 justify-self-end font-mono text-xs tracking-[0.08em] text-muted uppercase md:ml-auto">
          {[project.context, project.year].filter(Boolean).join(" · ")}
        </span>
      </div>
      {/* Mobile: descrição em até 4 linhas (o `summary` é curto demais para preencher), tags enxutas e um "botão" visual. O clique é do ProjectOpenButton, que cobre
          o card inteiro; o "Ver detalhes" é só a affordance de toque (aria-hidden, sem foco duplicado).
          Alinhamento entre cards: a descrição sempre reserva 4 linhas (min-h 4lh) e o botão vai para o
          rodapé (mt-auto num article flex de altura cheia; os <li> do trilho já esticam por igual). */}
      <p className="mt-3 line-clamp-4 min-h-[4lh] text-sm leading-relaxed text-bone-dim md:hidden">{project.description}</p>
      <TagList tags={project.tags} mobileLimit={3} className="mt-4 max-md:mb-5" />
      <span
        aria-hidden="true"
        className="mt-auto flex min-h-12 items-center justify-between rounded-full border border-line-strong px-5 text-sm font-medium md:hidden"
      >
        Ver detalhes
        <span>→</span>
      </span>
    </>
  );

  // O card inteiro abre o modal do case; o link do site fica no modal ("Visitar projeto ↗").
  return (
    <li
      data-cursor="Ver case"
      className="group/card relative group-data-horizontal:w-[min(82vw,calc((100svh_-_30rem)_*_1.6))] group-data-horizontal:shrink-0 md:group-data-horizontal:w-[min(62vw,calc((100svh_-_24rem)_*_1.6))] lg:group-data-horizontal:w-[min(42vw,720px,calc((100svh_-_26rem)_*_1.6))]"
    >
      <article className="flex h-full flex-col">{body}</article>
      <ProjectOpenButton index={index} name={project.name} />
    </li>
  );
}

export function Projects() {
  return (
    <section id="trabalhos" aria-labelledby="trabalhos-title" className="scroll-mt-20 bg-ink-850">
      <ProjectCase projects={projects}>
        <HorizontalPin
          total={projects.length}
          header={
            <div className="grid gap-4">
              <SectionLabel index={2}>Trabalhos selecionados</SectionLabel>
              <h2
                id="trabalhos-title"
                className="font-display text-[clamp(3.5rem,9vw,8rem)] leading-[0.9] tracking-[-0.02em]"
              >
                Projetos
              </h2>
            </div>
          }
        >
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </HorizontalPin>
      </ProjectCase>
    </section>
  );
}
