"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useId, useState } from "react";
import { TagList } from "@/components/ui/Tag";
import type { Service } from "@/types/content";

/*
 * Acordeão (padrão WAI-ARIA): cada título é um <button> dentro de <h3> com aria-expanded e
 * aria-controls. Motion anima a altura até "auto", o que CSS puro não faz.
 * reducedMotion="user" desliga as animações de transform/layout com movimento reduzido.
 */
export function Accordion({ items }: { items: Service[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);
  const baseId = useId();

  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
      <ul className="border-b border-line">
        {items.map((item, index) => {
          const open = openId === item.id;
          const buttonId = `${baseId}-${item.id}-button`;
          const panelId = `${baseId}-${item.id}-panel`;

          return (
            <li key={item.id} className="border-t border-line">
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenId(open ? null : item.id)}
                  className="group flex w-full items-baseline gap-6 py-8 text-left md:gap-10 md:py-10"
                >
                  <span className="font-mono text-sm text-muted tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 font-display text-4xl leading-none transition-colors duration-300 group-hover:text-accent-text md:text-6xl lg:text-7xl motion-reduce:transition-none">
                    {item.title}
                  </span>
                  {/* Cópia visual das tags ao lado do ícone (só desktop). aria-hidden para não entrarem
                      no nome do botão; o leitor de tela lê a lista que fica no painel. */}
                  <span
                    aria-hidden="true"
                    className="hidden flex-wrap justify-end gap-x-5 gap-y-1 self-center font-mono text-xs tracking-[0.08em] text-muted uppercase md:flex md:max-w-md"
                  >
                    {item.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </span>
                  <motion.span
                    aria-hidden="true"
                    animate={{ rotate: open ? 45 : 0 }}
                    className="self-center font-mono text-2xl text-muted md:text-3xl"
                  >
                    +
                  </motion.span>
                </button>
              </h3>

              <AnimatePresence initial={false}>
                {open ? (
                  <motion.div
                    key="panel"
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid gap-6 pb-10 md:grid-cols-12 md:pb-12">
                      <p className="text-lg leading-relaxed text-bone-dim md:col-span-12">
                        {item.description}
                      </p>
                      {/* No mobile as tags aparecem aqui; no desktop ficam só para leitor de tela
                          (a versão visível está ao lado do ícone). */}
                      <TagList tags={item.tags} className="content-start md:sr-only" />
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </MotionConfig>
  );
}
