import type { Image, Project } from "@/types/content";

// Número exibido ("01", "02"...) e o contador "01 / 12" são derivados da posição no array.
// Prints em public/images/projects/<slug>.webp (1600×1000). Ajuste width/height se o print for diferente.
// Modal "Ver case": summary, details, gallery, href e repo são opcionais; o que faltar some do modal
// (sem `details` ele mostra a `description` em "O projeto"; sem `gallery`, só o print principal).
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
    description:
      "Site institucional de uma representação comercial gaúcha de marcas de moda e streetwear (QIX, West Coast, Orange, entre outras), que desenvolvi do zero. Usei Nuxt 3 com roteamento por arquivos e componentes Vue 3 em Composition API (<script setup>), um por seção. O layout é responsivo e mobile-first, com menu animado, vitrine filtrada por marca com estado reativo (ref/computed) e CTAs integrados ao WhatsApp. Estilizei com Tailwind CSS v4 e servi as imagens em WebP e SVG para ganhar performance.",
    tags: ["Vue.js", "Nuxt.js", "Tailwind CSS"],
    image: print("kr", "KR Representação"),
  },
  {
    slug: "superepi",
    name: "Super Epi",
    context: "Agência Agliardi",
    description:
      "Front-end headless da Super EPI, loja de equipamentos de proteção individual. Atuei numa plataforma multi-loja em que cada cliente é uma aplicação Nuxt fina, que estende layers modulares compartilhadas (catálogo, checkout, conta, CMS, SEO e analytics), com dados vindos de uma API Laravel integrada à Linx. A renderização é SSR com cache de HTML na edge (Cloudflare Workers) e o conteúdo é montado em blocos pelo CMS. O projeto inclui SEO técnico (JSON-LD, canonical, robots), GTM com Consent Mode v2 e server-side tagging, monitoramento com Sentry e orçamento de performance com Lighthouse diário em CI.",
    tags: ["Manux Headless", "Nuxt.js", "TypeScript", "Performance"],
    image: print("superepi", "Super Epi"),
  },
  {
    slug: "milhas-plus",
    name: "Milhas Plus",
    context: "Pessoal",
    summary: "Operação de milhas aéreas, do kanban de contas à auditoria.",
    description:
      "Plataforma interna para operação de milhas aéreas, com painel administrativo (kanban de contas, cartões e limites, dashboard financeiro e auditoria) e um formulário público de cadastro de fornecedores. Desenvolvi o front-end como SPA em React 19 com React Router e a API REST em Express, rodando como Vercel Functions, com PostgreSQL no Supabase e migrations versionadas. A autenticação usa JWT com controle por papéis; senhas e dados de cartão são criptografados em repouso com AES-256-GCM, e cada acesso a eles fica registrado em log de auditoria. As atualizações chegam em tempo real via Server-Sent Events, com fallback para polling, e o CI no GitHub Actions roda lint, testes (Vitest e Playwright) e build.",
    details: [
      {
        title: "O projeto",
        body: "Plataforma interna para operação de milhas aéreas, com painel administrativo (kanban de contas, cartões e limites, dashboard financeiro e auditoria) e um formulário público de cadastro de fornecedores.",
      },
      {
        title: "Arquitetura",
        body: "Desenvolvi o front-end como SPA em React 19 com React Router e a API REST em Express, rodando como Vercel Functions, com PostgreSQL no Supabase e migrations versionadas. As atualizações chegam em tempo real via Server-Sent Events, com fallback para polling.",
      },
      {
        title: "Segurança",
        body: "A autenticação usa JWT com controle por papéis; senhas e dados de cartão são criptografados em repouso com AES-256-GCM, e cada acesso a eles fica registrado em log de auditoria.",
      },
      {
        title: "Qualidade",
        body: "O CI no GitHub Actions roda lint, testes (Vitest e Playwright) e build.",
      },
    ],
    tags: ["React.js", "Tailwind CSS", "CMS", "Python", "Automação"],
    image: print("milhasplus", "Milhas Plus"),
  },
  {
    slug: "zanque",
    name: "Zanque",
    context: "Agência Agliardi",
    description:
      "E-commerce headless na Uappi, com front-end desacoplado em Nuxt e TypeScript e foco em SEO e performance. Participei do desenvolvimento da loja: codifiquei o front-end, deixei o layout responsivo e implementei melhorias de SEO. Criei a lista de casamento, funcionalidade desenvolvida em conjunto com a Uappi, e componentes reutilizáveis pensados para renderização no servidor e no cliente, além da integração com o CMS da plataforma.",
    tags: UAPPI_HEADLESS,
    image: print("zanque", "Zanque"),
  },
  {
    slug: "pet-jr",
    name: "Pet JR",
    context: "Agência Agliardi",
    description:
      "E-commerce headless na Uappi, com front-end desacoplado em Nuxt e TypeScript e foco em SEO e performance. Participei do desenvolvimento da loja: codifiquei o front-end, deixei o layout responsivo e implementei melhorias de SEO. Criei um quiz em que o cliente informa raça, porte e idade do pet e recebe recomendações de produtos, além de componentes reutilizáveis pensados para renderização no servidor e no cliente e da integração com o CMS da Uappi.",
    tags: UAPPI_HEADLESS,
    image: print("petjr", "Pet JR"),
  },
  {
    slug: "lebes",
    name: "Lebes",
    context: "Agência Agrada",
    description:
      "Desenvolvimento e manutenção da loja na Linx Commerce, com foco em SEO e performance. Atuei na implementação de novas funcionalidades, na otimização de SEO e em melhorias de carregamento, usando Liquid (a linguagem de templates da plataforma), jQuery, HTML e Sass.",
    tags: LINX,
    image: print("lebes", "Lebes"),
  },
  {
    slug: "coliseu",
    name: "Coliseu",
    context: "Agência Agrada",
    description:
      "Manutenção e evolução da loja na Linx Commerce. Implementei novas funcionalidades, ajustes de SEO e melhorias de performance nos templates da plataforma, trabalhando com Liquid, jQuery, HTML e Sass.",
    tags: LINX,
    image: print("coliseu", "Coliseu"),
  },
  {
    slug: "docol",
    name: "Docol",
    context: "Agência Agrada",
    description:
      "Manutenção e evolução da loja na Linx Commerce, com foco em SEO e performance. Atuei na entrega de novas funcionalidades e na otimização das páginas, escrevendo os templates em Liquid, com jQuery, HTML e Sass.",
    tags: LINX,
    image: print("docol", "Docol"),
  },
  {
    slug: "schumann",
    name: "Schumann",
    context: "Agência Agrada",
    description:
      "Desenvolvimento e manutenção da loja na Linx Commerce. Participei da construção de novas funcionalidades, da otimização de SEO e de melhorias de performance, usando Liquid, jQuery, HTML e Sass sobre a estrutura nativa da plataforma.",
    tags: LINX,
    image: print("schumann", "Schumann"),
  },
  {
    slug: "merito-comercial",
    name: "Merito Comercial",
    context: "Agência Agliardi",
    description:
      "Desenvolvimento e manutenção da loja na Linx Commerce, com foco em SEO e performance. Atuei na implementação de funcionalidades e na otimização das páginas, trabalhando com Liquid, jQuery, HTML e Sass.",
    tags: LINX,
    image: print("meritocomercial", "Merito Comercial"),
  },
  {
    slug: "millenial-joias",
    name: "Millenial Joias",
    context: "Pessoal",
    description:
      "Desenvolvimento da loja de joias na Linx Commerce, com foco em SEO e performance. Construí os templates em Liquid, com jQuery, HTML e Sass, implementei as funcionalidades da loja e otimizei SEO e carregamento das páginas.",
    tags: LINX,
    image: print("millenial", "Millenial Joias"),
  },
  {
    slug: "multisom",
    name: "Multisom",
    context: "Agência Agrada",
    description:
      "Desenvolvimento e manutenção da loja na Linx Commerce. Atuei em novas funcionalidades, otimização de SEO e melhorias de performance, usando Liquid, a linguagem de templates da plataforma, junto com jQuery, HTML e Sass.",
    tags: LINX,
    image: print("multisom", "Multisom"),
  },
];
