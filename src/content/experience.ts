import type { Experience } from "@/types/content";

// Ordem: mais recente primeiro. `end: null` marca o emprego atual.
// Tags extraídas das tecnologias citadas em cada descrição.
export const experience: Experience[] = [
  {
    start: "2025",
    end: null,
    role: "Front-end engineer",
    company: "Milhas Plus ",
    description:
      "Desenvolvimento de plataformas internas de operação e gestão com Nuxt 3, Vue 3, React e TypeScript, integradas a APIs REST em FastAPI e Node.js. Construção de interfaces responsivas com Tailwind CSS e HeroUI, incluindo dashboards, filtros avançados, formulários dinâmicos e fluxos operacionais. Atuação na evolução do Design System com componentes padronizados e utilitários reutilizáveis, otimização de performance no front-end e apoio na melhoria de consultas no backend. Responsável também por refatoração, correção de bugs, aumento da cobertura de testes, code reviews e resolução de conflitos de merge. Contribuí com os módulos Hub do Emissor, Quadro Operacional, Financeiro, Eventos, Templates de Formulário, Dashboard e Gestão de Contas.",
    tags: ["Nuxt.js", "TypeScript", "React", "Next.js", "IA", "Python"],
  },
  {
    start: "2024",
    end: null,
    role: "Front-end engineer",
    company: "Manux",
    description:
      "Atuação em conjunto com o time de projetos no desenvolvimento de soluções de e-commerce utilizando a arquitetura Headless da Manux. Desenvolvimento de aplicações com Vue.js, Nuxt.js, TypeScript e JavaScript, priorizando performance, SEO, escalabilidade e experiência do usuário. Responsável pela criação de componentes reutilizáveis e interfaces escaláveis, com desenvolvimento client-side e server-side, integração com APIs e serviços de back-end, otimização de aplicações e garantia da qualidade por meio de testes e da adoção de boas práticas de engenharia de software. Participação ativa na implementação de desenvolvimento assistido por Inteligência Artificial, utilizando Skills, Rules e agentes inteligentes para acelerar entregas, elevar a qualidade do código, automatizar processos e apoiar decisões técnicas durante o ciclo de desenvolvimento.",
    tags: ["Vue.js", "Nuxt.js", "TypeScript", "Headless", "IA"],
  },
  {
    start: "2024",
    end: "2026",
    role: "Front-end engineer",
    company: "Agliardi.io",
    description:
      "Atuação no desenvolvimento, manutenção e customização de lojas virtuais em plataformas como Linx Commerce, Nuvemshop, Shopify e Uappi, criando experiências digitais otimizadas e alinhadas aos objetivos estratégicos do negócio. Experiência em projetos de Headless Commerce, desenvolvendo front-ends desacoplados com Vue.js 3, Nuxt.js e Tailwind CSS, com foco em performance, escalabilidade, flexibilidade e excelência na experiência do usuário. Responsável pelo desenvolvimento de integrações, implementação de funcionalidades estratégicas e configuração do Google Tag Manager (GTM), incluindo a criação de eventos personalizados, monitoramento da jornada do usuário e análise de métricas para otimização da conversão e da performance das aplicações.",
    tags: ["Vue.js 3", "Nuxt.js", "Tailwind CSS", "Headless Commerce", "GTM"],
  },
  // TODO: Agrada Digital (2022 — 2024) e demais experiências — texto chegou cortado.
];
