type SectionLabelProps = {
  index: number;
  children: string;
  /** Com `id`, o rótulo vira o <h2> da seção (usado no aria-labelledby). */
  as?: "h2" | "p";
  id?: string;
  className?: string;
};

/** Rótulo mono no formato "(01) Sobre". */
export function SectionLabel({ index, children, as: Tag = "p", id, className = "" }: SectionLabelProps) {
  return (
    <Tag id={id} className={`section-label ${className}`}>
      <span aria-hidden="true">({String(index).padStart(2, "0")}) </span>
      {children}
    </Tag>
  );
}
