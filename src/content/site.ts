import type { SiteContent } from "@/types/content";

// Textos com [PLACEHOLDER] serão preenchidos pelo dono do projeto.
// width/height das imagens: ajustar às dimensões reais quando os arquivos chegarem em public/images/.
export const site: SiteContent = {
  url: "https://vagnerzezo.vercel.app",
  name: { first: "Vagner", last: "Zezo" },
  role: "Desenvolvedor Front-end",
  description:
    "Portfolio de Vagner Zezo, desenvolvedor front-end especializado em Vue, Nuxt, React, Next.js e VTEX.",
  intro: "Front-end engineer, Tech Lead.",
  availability: "Disponível para projetos",
  avatar: {
    src: "/images/vz.webp",
    alt: "Retrato de Vagner Zezo",
    width: 400,
    height: 400,
  },
  nav: [
    { label: "Trabalhos", href: "#trabalhos" },
    { label: "Sobre", href: "#sobre" },
    { label: "Serviços", href: "#servicos" },
    { label: "Contato", href: "#contato" },
  ],
  tech: ["Vue.js", "Nuxt", "React", "Next.js", "TypeScript", "JavaScript", "Node.js", "GSAP"],
  about: {
    image: {
      src: "/images/fullbanners.webp",
      alt: "[PLACEHOLDER] Descrição da foto da seção Sobre",
      width: 1600,
      height: 900,
    },
    text: {
      before: "Me chamo Vagner Zezo, sou ",
      highlight: "front-end engineer com mais de 7 anos de experiência",
      after:
        " no desenvolvimento de aplicações web e e-commerce. Especialista em React, Next.js, Vue.js, Nuxt.js e TypeScript, com foco em arquitetura front-end, performance, SEO e experiência do usuário. Experiência em liderança técnica, integrações e entrega de soluções escaláveis alinhadas aos objetivos de negócio.",
    },
  },
  contact: {
    email: "vagnerzezo@live.com",
    socials: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/vagner-xavier/" },
      { label: "GitHub", href: "https://github.com/vagnerzezo" },
      { label: "Instagram", href: "https://www.instagram.com/vagnerzezo/" },
    ],
  },
  resumeUrl: "",
};
