import type { Image, Project } from "@/types/content";

// Número exibido ("01", "02"...) e o contador "01 / 12" são derivados da posição no array.
// Prints em public/images/projects/<slug>.webp (1600×1000). Ajuste width/height se o print for diferente.
const print = (slug: string, name: string): Image => ({
  src: `/images/projects/${slug}.webp`,
  alt: `Print do site ${name}`,
  width: 1600,
  height: 1000,
});

const LINX = ["Linx Commerce", "jQuery", "Liquid", "SEO", "Performance"];
const UAPPI_HEADLESS = ["Vue.js", "Nuxt.js", "TypeScript", "Performance", "Uappi"];

export const projects: Project[] = [
  {
    slug: "kr",
    name: "KR Representação",
    context: "Pessoal",
    tags: ["Vue.js", "Nuxt.js", "Tailwind CSS"],
    image: print("kr", "KR Representação"),
  },
  {
    slug: "superepi",
    name: "Super Epi",
    context: "Agência Agliardi",
    tags: ["Manux Headless", "Nuxt.js", "TypeScript", "Performance"],
    image: print("superepi", "Super Epi"),
  },
  {
    slug: "milhas-plus",
    name: "Milhas Plus",
    context: "Pessoal",
    tags: ["React.js", "Tailwind CSS", "CMS", "Python", "Automação"],
    image: print("milhasplus", "Milhas Plus"),
  },
  {
    slug: "zanque",
    name: "Zanque",
    context: "Agência Agliardi",
    tags: UAPPI_HEADLESS,
    image: print("zanque", "Zanque"),
  },
  {
    slug: "pet-jr",
    name: "Pet JR",
    context: "Agência Agliardi",
    tags: UAPPI_HEADLESS,
    image: print("petjr", "Pet JR"),
  },
  { slug: "lebes", name: "Lebes", context: "Agência Agrada", tags: LINX, image: print("lebes", "Lebes") },
  { slug: "coliseu", name: "Coliseu", context: "Agência Agrada", tags: LINX, image: print("coliseu", "Coliseu") },
  { slug: "docol", name: "Docol", context: "Agência Agrada", tags: LINX, image: print("docol", "Docol") },
  { slug: "schumann", name: "Schumann", context: "Agência Agrada", tags: LINX, image: print("schumann", "Schumann") },
  {
    slug: "merito-comercial",
    name: "Merito Comercial",
    context: "Agência Agliardi",
    tags: LINX,
    image: print("meritocomercial", "Merito Comercial"),
  },
  {
    slug: "millenial-joias",
    name: "Millenial Joias",
    context: "Pessoal",
    tags: LINX,
    image: print("millenial", "Millenial Joias"),
  },
  { slug: "multisom", name: "Multisom", context: "Agência Agrada", tags: LINX, image: print("multisom", "Multisom") },
];
