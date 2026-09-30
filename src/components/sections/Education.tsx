import { StaggerReveal } from "@/components/motion/StaggerReveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { education } from "@/content/education";
import type { Course } from "@/types/content";

/*
 * Três colunas no desktop: título da seção | cards acadêmicos | lista de cursos.
 * Tudo aqui é Server Component; a única ilha client é o StaggerReveal dos cards.
 * Os efeitos de hover dos cursos (seta girando, sublinhado crescendo) são CSS puro.
 */
export function Education() {
  return (
    <section id="formacao" aria-labelledby="formacao-title" className="scroll-mt-20 pb-28 md:pb-40">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="grid content-start gap-8 lg:col-span-3">
          <SectionLabel index={5}>Formação</SectionLabel>
          <h2
            id="formacao-title"
            className="font-display text-[clamp(3rem,6vw,5rem)] leading-[0.95] tracking-[-0.02em]"
          >
            Sempre <em>estudando</em>
          </h2>
        </div>

        <div className="grid content-start gap-6 lg:col-span-4">
          <h3 className="section-label">Acadêmica</h3>
          <StaggerReveal>
            <ul className="grid gap-5">
              {education.academic.map((item) => (
                <li
                  key={`${item.institution}-${item.degree}`}
                  data-reveal-item
                  className="grid gap-4 border border-line p-7 md:p-8"
                >
                  <p className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs tracking-[0.08em] text-muted uppercase">
                    {item.period}
                    {item.status === "em-andamento" ? <InProgress /> : null}
                  </p>
                  <div className="grid gap-2">
                    <h4 className="font-display text-3xl leading-tight md:text-4xl">{item.degree}</h4>
                    <p className="text-bone-dim">{item.institution}</p>
                  </div>
                </li>
              ))}
            </ul>
          </StaggerReveal>
        </div>

        <div className="grid content-start gap-6 lg:col-span-5">
          <h3 className="section-label">Cursos e certificações</h3>
          <ul className="border-t border-line">
            {education.courses.map((course) => (
              <li key={`${course.title}-${course.provider}`} className="group relative border-b border-line">
                <CourseRow course={course} />
                {/* Sublinhado que cresce da esquerda no hover/foco (scaleX). */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-bone transition-transform duration-500 ease-out group-focus-within:scale-x-100 group-hover:scale-x-100 motion-reduce:transition-none"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/** Linha do curso. Com `href` a linha inteira vira link (alvo grande) e ganha a seta ↗. */
function CourseRow({ course }: { course: Course }) {
  const content = (
    <>
      <span className="grid gap-1">
        <span className="font-semibold">{course.title}</span>
        <span className="text-sm text-muted">{course.provider}</span>
      </span>
      <span className="flex shrink-0 items-center gap-6 font-mono text-xs tracking-[0.08em] text-muted uppercase">
        {course.status === "em-andamento" ? <InProgress /> : course.period}
        {course.href ? (
          <span
            aria-hidden="true"
            className="text-base text-bone transition-transform duration-300 group-hover:rotate-45 motion-reduce:transition-none"
          >
            ↗
          </span>
        ) : null}
      </span>
    </>
  );

  const rowClass = "flex min-h-11 items-center justify-between gap-6 py-5";

  if (!course.href) return <div className={rowClass}>{content}</div>;

  return (
    <a href={course.href} target="_blank" rel="noopener noreferrer" className={rowClass}>
      {content}
      <span className="sr-only"> (certificado, abre em nova aba)</span>
    </a>
  );
}

/** Selo "Em andamento" com ponto accent pulsando devagar. */
function InProgress() {
  return (
    <span className="inline-flex items-center gap-2 text-accent-text">
      <span aria-hidden="true" className="size-1.5 rounded-full bg-accent motion-safe:animate-pulse-slow" />
      Em andamento
    </span>
  );
}
