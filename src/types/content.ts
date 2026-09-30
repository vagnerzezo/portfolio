/**
 * Tipos do conteúdo do site. Os componentes recebem estes tipos e nunca têm texto próprio:
 * trocar um texto é editar `src/content/*.ts`, não a UI.
 */

export interface Link {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  /** Âncora da seção na própria página, ex.: "#trabalhos". */
  href: `#${string}`;
}

export interface Image {
  src: string;
  alt: string;
  width: number;
  height: number;
}

/** Parágrafo com um trecho em destaque (itálico accent-text), ex.: o texto da seção Sobre. */
export interface HighlightedText {
  before: string;
  highlight: string;
  after: string;
}

export interface SiteContent {
  /** URL de produção, sem barra no final. Base do metadata, sitemap e JSON-LD. */
  url: string;
  name: { first: string; last: string };
  role: string;
  /** Usada na meta description. */
  description: string;
  /** Frase de apresentação do hero, ao lado do avatar. */
  intro: string;
  availability: string;
  avatar: Image;
  nav: NavItem[];
  tech: string[];
  about: {
    image: Image;
    /** Parágrafo grande (display), revelado palavra a palavra no scroll. */
    text: HighlightedText;
  };
  contact: {
    email: string;
    socials: Link[];
  };
  /** Link do "Currículo completo ↗" na seção Experiência (PDF ou LinkedIn). */
  resumeUrl: string;
}

export interface Project {
  slug: string;
  name: string;
  /** Onde o projeto foi feito, ex.: "Pessoal", "Agência Agliardi". */
  context: string;
  /** Texto do projeto e do seu papel nele. Aparece só no modal (em "O projeto" quando não há `details`). */
  description: string;
  year?: number | string;
  tags: string[];
  image: Image;
  /** Site no ar ("Visitar projeto ↗" no modal). */
  href?: string;
  /** Repositório ("Código ↗" no modal). */
  repo?: string;
  /** Linha de resumo abaixo do nome, no modal. */
  summary?: string;
  /** Blocos de texto do modal ("O projeto", "Arquitetura"...). Sem eles, o modal usa `description`. */
  details?: ProjectDetail[];
  /** Prints extras do modal. Sem eles, a galeria mostra só `image`. */
  gallery?: GalleryItem[];
}

export interface ProjectDetail {
  title: string;
  body: string;
}

export interface GalleryItem {
  image: Image;
  /** Nome curto da tela, ex.: "Kanban" (vira a legenda das miniaturas). */
  label: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

export interface Experience {
  /** Formato livre para exibição, ex.: "2022". */
  start: string;
  /** `null` = emprego atual (mostra o selo "Atual"). */
  end: string | null;
  role: string;
  company: string;
  description: string;
  tags: string[];
}

export type EducationStatus = "concluido" | "em-andamento";

export interface AcademicEducation {
  institution: string;
  degree: string;
  period: string;
  status: EducationStatus;
}

export interface Course {
  title: string;
  provider: string;
  /** Formato livre para exibição, ex.: "2023 — 2024". */
  period: string;
  /** "em-andamento" troca o período pelo selo com ponto pulsando. Omitido = concluído. */
  status?: EducationStatus;
  href?: string;
}

export interface EducationContent {
  academic: AcademicEducation[];
  courses: Course[];
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  /** Foto da pessoa. Sem ela, o círculo mostra as iniciais do nome. */
  avatar?: Image;
  /** Perfil no LinkedIn, exibido como "Ver no LinkedIn ↗". */
  href?: string;
}
