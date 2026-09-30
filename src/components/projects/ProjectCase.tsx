"use client";

import { useLenis } from "lenis/react";
import Image from "next/image";
import { createContext, useContext, useId, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { TagList } from "@/components/ui/Tag";
import { Flip, gsap, MEDIA, useGSAP } from "@/lib/gsap";
import type { Project } from "@/types/content";

type OpenCase = (index: number, trigger: HTMLElement) => void;
const OpenCaseContext = createContext<OpenCase | null>(null);

/** Arraste (px) ou velocidade (px/ms) para baixo que fecha o bottom sheet no mobile. */
const DRAG_CLOSE_PX = 120;
const DRAG_CLOSE_VELOCITY = 0.6;

const pad = (n: number) => String(n).padStart(2, "0");
const matches = (query: string) => window.matchMedia(query).matches;
const lockPageScroll = (locked: boolean) => {
  document.documentElement.style.overflow = locked ? "hidden" : "";
};

/*
 * Ilha client da seção Projetos: guarda qual case está aberto e renderiza o modal ao lado dos
 * cards (que continuam vindo do servidor). Os cards só recebem um <ProjectOpenButton>.
 *
 * O modal é um <dialog> nativo aberto com showModal(): o navegador já prende o foco dentro dele,
 * deixa o resto da página inerte e dispara `cancel` no Esc. A gente só acrescenta as animações,
 * o bloqueio do scroll (Lenis parado + overflow no <html>) e a devolução do foco ao card.
 */
export function ProjectCase({ projects, children }: { projects: Project[]; children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const closing = useRef(false);
  const lenis = useLenis();
  const [index, setIndex] = useState<number | null>(null);
  const [shot, setShot] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  const titleId = useId();
  const isOpen = index !== null;

  const { contextSafe } = useGSAP({ scope: dialog });

  const open: OpenCase = (next, trigger) => {
    // Foto do card guardada antes de abrir: é dela que a imagem do modal "cresce" (Flip).
    const image = trigger.closest("li")?.querySelector("[data-flip-id]");
    flipState.current = image && matches(MEDIA.motionOK) && matches(MEDIA.desktop) ? Flip.getState(image) : null;
    setShot(0);
    setAnnouncement("");
    setIndex(next);
  };

  const go = (step: number) => {
    if (index === null) return;
    const next = (index + step + projects.length) % projects.length;
    setShot(0);
    setIndex(next);
    setAnnouncement(`Projeto ${next + 1} de ${projects.length}: ${projects[next].name}`);
  };

  const finishClose = () => {
    const el = dialog.current!;
    const closedIndex = index;
    el.close();
    gsap.set(el.querySelectorAll("[data-case-panel], [data-case-scrim], [data-case-bg], [data-case-fade]"), {
      clearProps: "all",
    });
    lockPageScroll(false);
    lenis?.start();
    closing.current = false;
    setIndex(null);
    // Foco volta para o card do projeto que estava aberto (pode não ser o que abriu o modal).
    document.querySelector<HTMLElement>(`[data-case-open="${closedIndex}"]`)?.focus({ preventScroll: true });
  };

  // contextSafe dentro do handler (e não no render): tweens criados aqui entram no contexto do useGSAP
  // e são limpos no unmount.
  const requestClose = () => contextSafe(animateClose)();
  const animateClose = () => {
    if (closing.current || !dialog.current?.open) return;
    closing.current = true;
    if (!matches(MEDIA.motionOK)) return finishClose();

    const tl = gsap.timeline({ defaults: { ease: "power3.in" }, onComplete: finishClose });
    tl.to("[data-case-scrim]", { autoAlpha: 0, duration: 0.4 }, 0);
    if (matches(MEDIA.desktop)) {
      tl.to("[data-case-panel]", { opacity: 0, y: 24, duration: 0.35 }, 0);
    } else {
      tl.to("[data-case-panel]", { yPercent: 100, duration: 0.4 }, 0);
    }
  };

  // Abertura: showModal + trava o scroll + animação (Flip no desktop, sheet subindo no mobile).
  useGSAP(
    () => {
      if (!isOpen) return;
      const el = dialog.current!;
      el.showModal();
      lenis?.stop();
      lockPageScroll(true);
      if (!matches(MEDIA.motionOK)) return;

      // Só opacity (nunca autoAlpha) no que tem foco dentro: visibility: hidden tiraria o foco que o
      // showModal() acabou de pôr no primeiro botão, e ele cairia no <body>.
      gsap.from("[data-case-scrim]", { autoAlpha: 0, duration: 0.5, ease: "power2.out" });
      if (!matches(MEDIA.desktop)) {
        gsap.from("[data-case-panel]", { yPercent: 100, duration: 0.6, ease: "expo.out" });
        return;
      }

      const state = flipState.current;
      flipState.current = null;
      if (state) {
        Flip.from(state, { targets: el.querySelector("[data-flip-id]"), duration: 0.9, ease: "expo.inOut", scale: true });
        gsap.from("[data-case-bg]", { opacity: 0, duration: 0.6, delay: 0.25, ease: "power2.out" });
        gsap.from("[data-case-fade]", { opacity: 0, y: 16, duration: 0.6, delay: 0.5, stagger: 0.06, ease: "power3.out" });
      } else {
        gsap.from("[data-case-panel]", { opacity: 0, y: 24, duration: 0.5, ease: "power3.out" });
      }
    },
    { dependencies: [isOpen], scope: dialog },
  );

  // Troca de projeto com o modal aberto: volta os textos ao topo e faz um fade curto no conteúdo.
  const previous = useRef<number | null>(null);
  useGSAP(
    () => {
      const switched = previous.current !== null && index !== null && previous.current !== index;
      previous.current = index;
      if (!switched) return;
      dialog.current!.querySelectorAll("[data-case-scroll]").forEach((node) => node.scrollTo({ top: 0 }));
      if (!matches(MEDIA.motionOK)) return;
      gsap.from("[data-case-swap]", { opacity: 0, y: 12, duration: 0.45, stagger: 0.04, ease: "power3.out" });
    },
    { dependencies: [index], scope: dialog },
  );

  // Mobile: arrastar o topo do sheet para baixo fecha; soltar antes do limite volta ao lugar.
  const onDragStart = (event: PointerEvent<HTMLElement>) => contextSafe(drag)(event);
  const drag = (event: PointerEvent<HTMLElement>) => {
    if (matches(MEDIA.desktop) || (event.target as Element).closest("button")) return;
    const handle = event.currentTarget;
    const panel = dialog.current!.querySelector<HTMLElement>("[data-case-panel]")!;
    const startY = event.clientY;
    let last = { y: startY, t: event.timeStamp, velocity: 0 };
    handle.setPointerCapture(event.pointerId);

    const onMove = (e: globalThis.PointerEvent) => {
      last = { y: e.clientY, t: e.timeStamp, velocity: (e.clientY - last.y) / Math.max(1, e.timeStamp - last.t) };
      gsap.set(panel, { y: Math.max(0, e.clientY - startY) });
    };
    const onUp = (e: globalThis.PointerEvent) => {
      handle.removeEventListener("pointermove", onMove);
      handle.removeEventListener("pointerup", onUp);
      handle.removeEventListener("pointercancel", onUp);
      if (e.clientY - startY > DRAG_CLOSE_PX || last.velocity > DRAG_CLOSE_VELOCITY) requestClose();
      else gsap.to(panel, { y: 0, duration: 0.4, ease: "expo.out" });
    };
    handle.addEventListener("pointermove", onMove);
    handle.addEventListener("pointerup", onUp);
    handle.addEventListener("pointercancel", onUp);
  };

  const project = index === null ? null : projects[index];
  const gallery = project ? (project.gallery ?? [{ image: project.image, label: "" }]) : [];
  const current = gallery[shot] ?? gallery[0];
  const details = project?.details ?? (project ? [{ title: "O projeto", body: project.description }] : []);
  const hasLinks = Boolean(project?.href || project?.repo);

  return (
    <OpenCaseContext.Provider value={open}>
      {children}

      <dialog
        ref={dialog}
        aria-labelledby={titleId}
        onCancel={(event) => {
          event.preventDefault();
          requestClose();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") go(1);
          if (event.key === "ArrowLeft") go(-1);
        }}
        className="fixed inset-0 m-0 size-full max-h-none max-w-none items-end justify-center overflow-visible bg-transparent p-0 text-bone backdrop:bg-transparent open:flex lg:items-center lg:p-10"
      >
        <div data-case-scrim aria-hidden="true" onClick={requestClose} className="absolute inset-0 bg-ink-950/85 backdrop-blur-sm" />

        {project ? (
          <div
            data-case-panel
            className="relative flex h-[94dvh] w-full flex-col lg:h-[min(46rem,calc(100dvh-5rem))] lg:max-w-[76rem]"
          >
            <div aria-hidden="true" data-case-bg className="absolute inset-0 rounded-t-2xl border border-line bg-ink-900 lg:rounded-2xl" />

            <header
              data-case-fade
              onPointerDown={onDragStart}
              className="relative flex touch-none items-center justify-between gap-4 border-b border-line px-5 pt-5 pb-3 lg:touch-auto lg:px-8 lg:py-4"
            >
              <span aria-hidden="true" className="absolute top-2 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-line-strong lg:hidden" />
              <p className="font-mono text-xs tracking-[0.08em] text-muted uppercase">
                <span className="hidden sm:inline">Projeto </span>
                <span className="text-bone tabular-nums">{pad(index! + 1)}</span> / {pad(projects.length)} · {project.context}
              </p>
              <p className="sr-only" aria-live="polite">
                {announcement}
              </p>
              <div className="flex items-center gap-3">
                <div className="hidden gap-3 lg:flex">
                  <button type="button" onClick={() => go(-1)} aria-label="Projeto anterior" className="carousel-btn">
                    <Arrow direction="left" />
                  </button>
                  <button type="button" onClick={() => go(1)} aria-label="Próximo projeto" className="carousel-btn">
                    <Arrow direction="right" />
                  </button>
                </div>
                <span aria-hidden="true" className="hidden h-8 w-px bg-line lg:block" />
                <button type="button" onClick={requestClose} aria-label="Fechar" className="carousel-btn">
                  <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 3l10 10M13 3L3 13" />
                  </svg>
                </button>
              </div>
            </header>

            {/* Mobile: tudo rola junto. Desktop: galeria fixa à esquerda, só a coluna de texto rola. */}
            <div
              data-lenis-prevent
              data-case-scroll
              className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:overflow-visible"
            >
              <div className="px-5 pt-5 lg:border-r lg:border-line lg:p-8">
                <div data-flip-id={`case-${project.slug}`} className="overflow-hidden rounded-lg bg-ink-850">
                  <Image
                    key={current.image.src}
                    src={current.image.src}
                    alt={current.image.alt}
                    width={current.image.width}
                    height={current.image.height}
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    loading="eager"
                    className="aspect-[16/10] w-full object-cover"
                  />
                </div>

                {gallery.length > 1 ? (
                  <>
                    <ul data-case-fade className="mt-3 hidden grid-cols-4 gap-3 lg:grid" aria-label="Prints do projeto">
                      {gallery.map((item, i) => (
                        <li key={item.image.src}>
                          <button
                            type="button"
                            onClick={() => setShot(i)}
                            aria-pressed={i === shot}
                            aria-label={`Ver print: ${item.label}`}
                            className="block w-full overflow-hidden rounded-md border border-transparent opacity-60 transition hover:opacity-100 aria-pressed:border-bone aria-pressed:opacity-100"
                          >
                            <Image
                              src={item.image.src}
                              alt=""
                              width={item.image.width}
                              height={item.image.height}
                              sizes="10vw"
                              className="aspect-[16/10] w-full object-cover"
                            />
                          </button>
                        </li>
                      ))}
                    </ul>
                    <p data-case-fade className="mt-3 hidden font-mono text-xs text-muted lg:block">
                      {gallery.map((item) => item.label).join(" · ")}
                    </p>
                    <ul className="mt-1 flex justify-center lg:hidden" aria-label="Prints do projeto">
                      {gallery.map((item, i) => (
                        <li key={item.image.src}>
                          <button
                            type="button"
                            onClick={() => setShot(i)}
                            aria-pressed={i === shot}
                            aria-label={`Ver print: ${item.label}`}
                            className="group/dot grid h-11 w-6 place-items-center"
                          >
                            <span className="h-0.5 w-2 rounded-full bg-line-strong transition-all group-aria-pressed/dot:w-5 group-aria-pressed/dot:bg-bone" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </div>

              <div className="flex flex-col lg:min-h-0">
                <div
                  data-lenis-prevent
                  data-case-scroll
                  data-case-fade
                  className="px-5 pt-6 pb-8 lg:flex-1 lg:overflow-y-auto lg:overscroll-contain lg:px-8 lg:pt-8 lg:[mask-image:linear-gradient(to_bottom,black_calc(100%-3rem),transparent)]"
                >
                  <h2 id={titleId} data-case-swap className="font-display text-5xl leading-none tracking-[-0.01em] lg:text-6xl">
                    {project.name}
                  </h2>
                  {project.summary ? (
                    <p data-case-swap className="mt-4 max-w-[48ch] text-lg text-bone-dim">
                      {project.summary}
                    </p>
                  ) : null}


                  <div aria-hidden="true" className="mt-6 h-px bg-line" />
                  {details.map((detail) => (
                    <section key={detail.title} data-case-swap className="mt-6">
                      <h3 className="font-mono text-[11px] tracking-[0.08em] text-muted uppercase">{detail.title}</h3>
                      <p className="mt-2 text-bone-dim">{detail.body}</p>
                    </section>
                  ))}

                  <TagList tags={project.tags} className="mt-8" />
                </div>

                <footer
                  data-case-fade
                  className={`sticky bottom-0 flex items-center gap-3 border-t border-line bg-ink-900 px-5 py-4 lg:static lg:border-0 lg:bg-transparent lg:px-8 lg:pt-4 lg:pb-8 ${hasLinks ? "" : "justify-end lg:hidden"}`}
                >
                  {project.href ? (
                    <CaseLink href={project.href} primary>
                      Visitar projeto
                    </CaseLink>
                  ) : null}
                  {project.repo ? <CaseLink href={project.repo}>Código</CaseLink> : null}
                  <button type="button" onClick={() => go(1)} aria-label="Próximo projeto" className="carousel-btn ml-auto shrink-0 lg:hidden">
                    <Arrow direction="right" />
                  </button>
                </footer>
              </div>
            </div>
          </div>
        ) : null}
      </dialog>
    </OpenCaseContext.Provider>
  );
}

/** Botão invisível que cobre o card inteiro e abre o case (o card em si continua Server Component). */
export function ProjectOpenButton({ index, name }: { index: number; name: string }) {
  const open = useContext(OpenCaseContext);
  if (!open) throw new Error("ProjectOpenButton precisa estar dentro de <ProjectCase>");

  return (
    <button
      type="button"
      data-case-open={index}
      aria-haspopup="dialog"
      onClick={(event) => open(index, event.currentTarget)}
      className="absolute inset-0 z-10 cursor-pointer rounded-sm"
    >
      <span className="sr-only">Ver case: {name}</span>
    </button>
  );
}

function CaseLink({ href, primary = false, children }: { href: string; primary?: boolean; children: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex min-h-12 items-center gap-2 rounded-full px-6 text-sm font-medium transition-colors ${
        primary
          ? "flex-1 justify-center bg-bone text-ink-950 hover:bg-bone-dim lg:flex-none"
          : "border border-line-strong hover:bg-bone hover:text-ink-950"
      }`}
    >
      {children}
      <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none">
        ↗
      </span>
      <span className="sr-only"> (abre em nova aba)</span>
    </a>
  );
}

function Arrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className={`size-4 ${direction === "left" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 8h12M9 3l5 5-5 5" />
    </svg>
  );
}
