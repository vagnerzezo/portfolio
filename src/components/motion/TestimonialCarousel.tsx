"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { gsap, MEDIA, SplitText, useGSAP } from "@/lib/gsap";
import { useMediaQuery } from "@/lib/use-media-query";
import type { Testimonial } from "@/types/content";

const AUTOPLAY_MS = 5000;
/** Distância mínima (px) do arraste no touch para trocar de depoimento. */
const SWIPE_PX = 60;

/*
 * Carrossel acessível: botões reais, autoplay só quando visível e pausado em hover/foco
 * (e com botão de pausa, WCAG 2.2.2). Enquanto roda sozinho, a região não é "live" para não
 * interromper o leitor de tela a cada troca; ao navegar manualmente, a troca é anunciada.
 * O texto troca linha a linha por máscara (SplitText); o autor troca com Motion.
 *
 * Layout (desktop): coluna esquerda com o cabeçalho (children, vindo do servidor) no topo e
 * contador + botões no pé; o depoimento ocupa a direita. No mobile empilha: cabeçalho,
 * depoimento, controles, e dá para arrastar o depoimento para os lados.
 */
export function TestimonialCarousel({ items, children }: { items: Testimonial[]; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const quote = useRef<HTMLParagraphElement>(null);
  const firstRender = useRef(true);
  const [index, setIndex] = useState(0);
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const motionOK = useMediaQuery(MEDIA.motionOK);
  const coarsePointer = useMediaQuery("(pointer: coarse)");

  const multiple = items.length > 1;
  const autoplay = multiple && motionOK && !userPaused;
  const running = autoplay && inView && !hovered && !focused;
  const current = items[index];

  const go = (step: number) => setIndex((i) => (i + step + items.length) % items.length);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.4 });
    observer.observe(root.current!);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % items.length), AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [running, index, items.length]);

  // Aspas giram levemente conforme a seção atravessa a tela (parallax com scrub).
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motionOK, () => {
        gsap.fromTo(
          "[data-quote-mark]",
          { rotate: -10, yPercent: 10 },
          {
            rotate: 8,
            yPercent: -10,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    },
    { scope: root },
  );

  useGSAP(
    () => {
      if (firstRender.current) {
        firstRender.current = false;
        return;
      }
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motionOK, () => {
        SplitText.create(quote.current!, {
          type: "lines",
          mask: "lines",
          aria: "none",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, { yPercent: 105, duration: 1, stagger: 0.08, ease: "expo.out" }),
        });
      });
    },
    { scope: root, dependencies: [index], revertOnUpdate: true },
  );

  if (!current) return null;

  const swipe = multiple && coarsePointer;

  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={root}
        role="group"
        aria-roledescription="carrossel"
        aria-label="Depoimentos"
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
        }}
        className="grid gap-12 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-10 lg:gap-y-16"
      >
        <div className="lg:col-span-3 lg:row-start-1">{children}</div>

        <motion.div
          aria-live={autoplay ? "off" : "polite"}
          drag={swipe ? "x" : false}
          dragSnapToOrigin
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (info.offset.x < -SWIPE_PX) go(1);
            else if (info.offset.x > SWIPE_PX) go(-1);
          }}
          className="grid content-start gap-10 touch-pan-y lg:col-span-9 lg:col-start-4 lg:row-span-2 lg:row-start-1"
        >
          <span
            aria-hidden="true"
            data-quote-mark
            className="block h-[0.5em] origin-center self-start justify-self-start font-display text-[6rem] leading-none text-accent md:text-[8rem]"
          >
            “
          </span>
          <blockquote>
            <p
              key={index}
              ref={quote}
              className="max-w-5xl font-display text-[clamp(1.875rem,3.6vw,3.5rem)] leading-[1.12] text-bone"
            >
              {current.quote}
            </p>
          </blockquote>
          <div className="border-t border-line pt-8">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4 }}
                className="flex flex-wrap items-center justify-between gap-6"
              >
                <div className="flex items-center gap-4">
                  <Avatar person={current} />
                  <p className="grid gap-0.5">
                    <span className="font-semibold text-bone">{current.author}</span>
                    <span className="text-sm text-muted">
                      {current.role} · {current.company}
                    </span>
                  </p>
                </div>
                {current.href ? (
                  <ArrowLink
                    href={current.href}
                    external
                    className="font-mono text-xs tracking-[0.08em] text-bone uppercase"
                  >
                    Ver no LinkedIn
                  </ArrowLink>
                ) : null}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {multiple ? (
          <div className="grid gap-6 lg:col-span-3 lg:row-start-2 lg:self-end">
            <p className="font-mono text-2xl text-bone tabular-nums">
              <span className="sr-only">Depoimento </span>
              {String(index + 1).padStart(2, "0")}
              <span className="text-faded">
                {" "}
                <span aria-hidden="true">/</span>
                <span className="sr-only">de</span> {String(items.length).padStart(2, "0")}
              </span>
            </p>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => go(-1)} aria-label="Depoimento anterior" className="carousel-btn">
                <span aria-hidden="true">←</span>
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Próximo depoimento"
                className="carousel-btn border-bone bg-bone text-ink-950 hover:bg-transparent hover:text-bone"
              >
                <span aria-hidden="true">→</span>
              </button>
              {motionOK ? (
                <button
                  type="button"
                  onClick={() => setUserPaused((paused) => !paused)}
                  aria-label={userPaused ? "Retomar troca automática" : "Pausar troca automática"}
                  className="carousel-btn ml-3 border-transparent text-xs text-muted"
                >
                  <span aria-hidden="true">{userPaused ? "▶" : "❚❚"}</span>
                </button>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </MotionConfig>
  );
}

/** Foto da pessoa ou, sem foto, as iniciais do nome num círculo (nunca uma foto inventada). */
function Avatar({ person }: { person: Testimonial }) {
  if (person.avatar) {
    return (
      <Image
        src={person.avatar.src}
        alt=""
        width={48}
        height={48}
        sizes="48px"
        className="size-12 rounded-full object-cover grayscale"
      />
    );
  }

  const initials = person.author
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .filter((_, i, all) => i === 0 || i === all.length - 1)
    .join("");

  return (
    <span
      aria-hidden="true"
      className="inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-line-strong font-mono text-xs text-muted"
    >
      {initials}
    </span>
  );
}
