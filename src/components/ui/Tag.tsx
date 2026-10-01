export function Tag({ children, className = "" }: { children: string; className?: string }) {
  return (
    <li
      className={`rounded-full border border-line-strong px-3 py-1 font-mono text-xs tracking-wide text-muted uppercase ${className}`}
    >
      {children}
    </li>
  );
}

/**
 * `mobileLimit`: abaixo de md mostra só as N primeiras tags e um "+X" com o resto. As escondidas
 * usam display: none (max-md:hidden), então também saem da árvore de acessibilidade no mobile.
 */
export function TagList({
  tags,
  className = "",
  mobileLimit,
}: {
  tags: string[];
  className?: string;
  mobileLimit?: number;
}) {
  const extra = mobileLimit === undefined ? 0 : tags.length - mobileLimit;
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`} aria-label="Tecnologias">
      {tags.map((tag, i) => (
        <Tag key={tag} className={extra > 0 && i >= mobileLimit! ? "max-md:hidden" : ""}>
          {tag}
        </Tag>
      ))}
      {extra > 0 ? (
        <li
          aria-label={`e mais ${extra}`}
          className="rounded-full bg-line px-3 py-1 font-mono text-xs text-muted md:hidden"
        >
          +{extra}
        </li>
      ) : null}
    </ul>
  );
}
