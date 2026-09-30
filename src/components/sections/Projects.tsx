import Image from "next/image";
import { HorizontalPin } from "@/components/motion/HorizontalPin";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TagList } from "@/components/ui/Tag";
import { projects } from "@/content/projects";
import type { Project } from "@/types/content";

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const body = (
    <>
      <div className="overflow-hidden bg-ink-900">
        <Image
          src={project.image.src}
          alt={project.image.alt}
          width={project.image.width}
          height={project.image.height}
          sizes="(min-width: 1024px) 45vw, (min-width: 768px) 50vw, 100vw"
          className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-[1.03] motion-reduce:transition-none"
        />
      </div>
      <div className="mt-6 flex items-baseline justify-between gap-4">
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-sm text-muted tabular-nums">{String(index + 1).padStart(2, "0")}</span>
          <h3 className="font-display text-3xl md:text-4xl">{project.name}</h3>
        </div>
        <span className="shrink-0 font-mono text-xs tracking-[0.08em] text-muted uppercase">
          {[project.context, project.year].filter(Boolean).join(" · ")}
        </span>
      </div>
      <TagList tags={project.tags} className="mt-4" />
    </>
  );

  return (
    <li
      data-cursor="Ver case"
      className="group/card group-data-horizontal:w-[min(42vw,720px,calc((100dvh_-_26rem)_*_1.6))] group-data-horizontal:shrink-0"
    >
      {project.href ? (
        <a href={project.href} className="block" target="_blank" rel="noopener noreferrer">
          {body}
          <span className="sr-only"> (abre em nova aba)</span>
        </a>
      ) : (
        <article>{body}</article>
      )}
    </li>
  );
}

export function Projects() {
  return (
    <section id="trabalhos" aria-labelledby="trabalhos-title" className="scroll-mt-20 bg-ink-850">
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
    </section>
  );
}
