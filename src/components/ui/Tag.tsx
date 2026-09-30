export function Tag({ children }: { children: string }) {
  return (
    <li className="rounded-full border border-line-strong px-3 py-1 font-mono text-xs tracking-wide text-muted uppercase">
      {children}
    </li>
  );
}

export function TagList({ tags, className = "" }: { tags: string[]; className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`} aria-label="Tecnologias">
      {tags.map((tag) => (
        <Tag key={tag}>{tag}</Tag>
      ))}
    </ul>
  );
}
