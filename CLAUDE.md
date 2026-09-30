@AGENTS.md

# Portfolio Vagner Zezo — contexto do projeto

Portfolio pessoal de um desenvolvedor front-end (Vue, Nuxt, React, Next.js, VTEX), hoje publicado em
`vagnerzezo.vercel.app`. Este redesign segue um layout editorial escuro, com animações de scroll como diferencial.
O dono do projeto está evoluindo para full stack: **explique decisões de arquitetura nos commits e PRs, não só o "como"**.

## Stack

- **Next.js** (App Router, versão estável mais recente) + **React** + **TypeScript** em modo `strict`
- **Tailwind CSS v4**: configuração CSS-first com `@theme` em `globals.css` (sem `tailwind.config.js`)
- **GSAP** + `@gsap/react` (`useGSAP`) + plugins **ScrollTrigger** e **SplitText**
- **Lenis** (`lenis/react`) para scroll suave, sincronizado com o ticker do GSAP
- **Motion** (`motion/react`) só para animações de layout (acordeão, troca de depoimentos)
- **React Three Fiber** + `@react-three/drei` para a esfera do hero
- **Zod** para validação, **Resend** para envio do e-mail do formulário de contato
- Deploy na **Vercel**; gerenciador de pacotes **pnpm**

## Regras de arquitetura (importantes)

1. **Server Components por padrão.** Seções de conteúdo (Sobre, Experiência, Formação, Serviços, Footer) são Server
   Components. Só vira `"use client"` o que tem animação, estado ou eventos, e mesmo assim como **ilha pequena**:
   a seção é server e envolve um componente client mínimo (ex.: `<ScrollWordReveal>{texto}</ScrollWordReveal>`).
2. **Conteúdo separado da UI.** Todo texto de projetos, experiência, formação, depoimentos e serviços vem de
   `src/content/*.ts`, tipado com os tipos de `src/types/content.ts`. Nada de conteúdo hardcoded nos componentes.
3. **GSAP registrado uma vez** em `src/lib/gsap.ts` (registra plugins e exporta `gsap`, `ScrollTrigger`, `SplitText`).
   Todo uso de GSAP em componente é via `useGSAP` com `scope` (limpeza automática no unmount).
4. **Movimento reduzido:** todas as animações usam `gsap.matchMedia()` com
   `(prefers-reduced-motion: no-preference)`. Com movimento reduzido: sem Lenis, sem pin, sem scrub, sem Three.js;
   o conteúdo aparece estático e legível.
5. **Three.js só no desktop e sob demanda:** `next/dynamic` com `ssr: false`, carregado apenas em telas ≥ 1024px
   e sem movimento reduzido. Fallback: o SVG estático da esfera.
6. **Acessibilidade:** HTML semântico (`section` com `aria-labelledby`, `h1` único, hierarquia de headings correta),
   foco visível, botões reais com `aria-label` quando só têm ícone, contraste AA, alvos de toque ≥ 44px.
   Cursor customizado nunca esconde o cursor nativo em teclado/touch.
7. **Performance:** `next/image` para todas as imagens com `sizes` corretos; foto do hero/sobre com `loading="eager"` (no Next 16 `priority` foi descontinuado em favor de `preload`)
   apenas se estiver acima da dobra; fontes via `next/font/google`. Meta: Lighthouse ≥ 90 em Performance e 100 em A11y.

## Estrutura de pastas

```
src/
  app/
    layout.tsx            # fontes, metadata, <SmoothScroll>, <Cursor>
    page.tsx              # compõe as seções na ordem
    globals.css           # @import "tailwindcss"; @theme com os tokens
    actions/contact.ts    # Server Action do formulário
    sitemap.ts
    robots.ts
    opengraph-image.tsx
  components/
    sections/             # Hero, TechMarquee, About, Projects, Services, Experience,
                          # Education, Testimonials, Contact, Footer
    motion/               # SmoothScroll, Preloader, LogoDraw, SplitReveal, ScrollWordReveal,
                          # HorizontalPin, VelocityMarquee, MagneticButton, Cursor
    three/                # HeroSphere (R3F), HeroSphereLoader (dynamic + media query)
    ui/                   # Logo, SectionLabel, Tag, ArrowLink
    contact/              # ContactForm (client, useActionState)
  content/                # site.ts, projects.ts, services.ts, experience.ts,
                          # education.ts, testimonials.ts
  lib/
    gsap.ts
    validations/contact.ts  # schema Zod compartilhado (client e server)
    rate-limit.ts
  types/content.ts
public/
  images/                 # fullbanner.webp, avatar.webp, vz.webp
  logo/                   # vz-logo-contorno.svg, vz-logo-animado.svg
```

## Design tokens (Tailwind v4 `@theme`)

| Token | Valor | Uso |
|---|---|---|
| `--color-ink-950` | `#0A0A09` | fundo mais escuro |
| `--color-ink-900` | `#0F0F0E` | fundo principal |
| `--color-ink-850` | `#141412` | fundo alternado (Projetos, Depoimentos) |
| `--color-line` | `#2A2A27` | divisórias |
| `--color-line-strong` | `#3A3934` | bordas de pills e botões |
| `--color-bone` | `#ECE8DF` | texto principal / fundo da seção Contato |
| `--color-bone-dim` | `#CFCAC0` | parágrafos |
| `--color-muted` | `#9C978C` | legendas e rótulos mono |
| `--color-faded` | `#6B675F` | texto "apagado" antes do scroll reveal |
| `--color-accent` | `#0702FE` | destaque decorativo: pontos, linhas, aspas (usar com parcimônia) |
| `--color-accent-text` | `#6F6CFE` | accent em texto e anel de foco (4,8:1 no fundo escuro; o `#0702FE` não passa no AA) |

Fontes (`next/font/google`, expostas como variáveis CSS):
- **Instrument Serif** (400, normal e itálico): títulos e display → `--font-display`
- **Manrope** (400–700): corpo → `--font-sans`
- **JetBrains Mono** (400–500): rótulos em caixa alta, números, datas → `--font-mono`

Rótulos de seção: mono, 13px, caixa alta, `letter-spacing: 0.08em`, cor `muted`, formato `(01) Sobre`.

## Logo

O logo oficial é o **VZ apenas em contorno** (sem preenchimento, sem cor de destaque).
Path (viewBox `0 0 585 260`):

```
M0 0H110L174 121L235 0H585L440 200H585V260H294L434 60H310L210 260H140Z
```

Componente `<Logo>` com `fill="none"`, `stroke="currentColor"`, `vector-effect="non-scaling-stroke"`,
`stroke-width` 1.5. Versão animada (`<LogoDraw>`): `pathLength={1}`, anima `stroke-dashoffset` de 1 → 0.

## Seções (ordem da página)

1. **Header**: logo, nav (Trabalhos, Sobre, Serviços, Contato), pill "Disponível para projetos" com ponto accent.
   Fica fixo e some ao rolar para baixo / volta ao rolar para cima.
2. **Hero**: "Vagner / *Zezo*." em Instrument Serif enorme (clamp até ~240px), esfera 3D à direita, avatar
   em preto e branco (`filter: grayscale`) ao lado da frase de apresentação, "Role para explorar".
3. **TechMarquee**: Vue.js ✳ Nuxt ✳ React ✳ Next.js ✳ TypeScript ✳ Node.js ✳ VTEX ✳ GSAP, serif itálico.
4. **(01) Sobre**: foto `fullbanner.webp` + parágrafo grande com trecho em itálico accent.
5. **(02) Projetos**: 4 cards (imagem, número, nome, ano, tags) + contador `01 / 04` + barra de progresso.
6. **(03) O que eu faço**: 4 linhas em acordeão (E-commerce VTEX, Vue & Nuxt, React & Next.js, Performance & A11y).
7. **(04) Experiência**: linha do tempo (período, cargo — empresa, descrição, tags), selo "Atual".
8. **(05) Formação**: cards acadêmicos + lista de cursos com link ↗; "Em andamento" com ponto accent.
9. **(06) Depoimentos**: carrossel com aspas grandes accent, autor, botões anterior/próximo.
10. **(07) Contato**: fundo `bone`, título "Vamos criar *algo juntos?*", **formulário** + links sociais.
11. **Footer**: © ano, "Voltar ao topo".

## Mapa de animações

| Onde | Efeito | Ferramenta |
|---|---|---|
| Global | Scroll suave (`lerp` ~0.1), sincronizado com `gsap.ticker` e `ScrollTrigger.update` | Lenis |
| Carregamento | Preloader 0→100 + logo se desenhando; sai com `clip-path` | GSAP |
| Hero | Letras do nome sobem por máscara com stagger | SplitText |
| Hero | Esfera de partículas com ruído, reage ao mouse e se dissolve ao rolar | R3F (shader) |
| Marquee | Velocidade e direção seguem `ScrollTrigger` velocity | GSAP |
| Sobre | Palavras passam de `faded` para `bone` com scrub; foto revela com `clip-path` | ScrollTrigger |
| Projetos | Seção com `pin`, scroll vertical move os cards na horizontal; contador atualiza | ScrollTrigger |
| Projetos | Hover: cursor vira círculo "Ver case" | Cursor custom |
| Serviços | Acordeão com animação de layout | Motion |
| Experiência | Itens entram com stagger; linha lateral desce com o scroll | ScrollTrigger |
| Depoimentos | Texto troca linha a linha por máscara; autoplay só visível, pausa em hover/foco | Motion / SplitText |
| Contato | Botão magnético (`gsap.quickTo`) | GSAP |
| Footer | Revelado "por baixo" do conteúdo (efeito cortina) | CSS sticky |

No mobile: sem pin horizontal (cards empilhados), sem cursor custom, sem Three.js.

## Formulário de contato (Server Action)

- Campos: `name` (2–80), `email` (e-mail válido), `message` (10–2000), `website` (honeypot, deve vir vazio).
- Schema Zod em `src/lib/validations/contact.ts`, **reutilizado** no client (feedback imediato) e no server
  (a validação que vale é sempre a do servidor).
- `src/app/actions/contact.ts` com `"use server"`:
  1. `safeParse` do `FormData`; retorna erros por campo se inválido.
  2. Honeypot preenchido → retorna sucesso falso silencioso (não avisa o bot).
  3. Rate limit por IP (header `x-forwarded-for`). Em dev pode ser em memória; **em produção serverless a memória
     não persiste entre invocações**, então usar Upstash Redis (`@upstash/ratelimit`) ou deixar um TODO explícito.
  4. Envia via Resend com `RESEND_API_KEY` e `CONTACT_TO_EMAIL` (variáveis de ambiente, nunca no client).
     O e-mail do visitante vai em `replyTo`, não em `from`.
  5. Retorna estado tipado: `{ status: "idle" | "success" | "error"; message?: string; fieldErrors?: {...} }`.
- `ContactForm` (client) usa `useActionState`, desabilita o botão com `pending`, mostra erros ligados aos campos
  via `aria-describedby` e anuncia o resultado numa região `aria-live="polite"`.
- Funciona sem JavaScript (progressive enhancement), pois é um `<form action={...}>` nativo.
- `.env.example` com as duas variáveis; `.env.local` no `.gitignore`.

## SEO

`metadata` no layout (title template, description, Open Graph, Twitter card), `opengraph-image.tsx`,
`sitemap.ts`, `robots.ts`, `lang="pt-BR"`, dados estruturados JSON-LD do tipo `Person`.

## Conteúdo pendente

Textos marcados como `[PLACEHOLDER]` em `src/content/*.ts` serão preenchidos pelo dono:
nomes e prints dos projetos, empresas e anos da experiência, formação, depoimentos reais, e-mail, links sociais.
**Nunca invente** depoimentos, empresas ou números.

## Ordem de implementação

1. Setup: create-next-app, Tailwind v4, tokens, fontes, estrutura de pastas, tipos e conteúdo placeholder.
2. Todas as seções **estáticas** (Server Components), responsivas e acessíveis, sem animação.
3. Formulário de contato com Server Action + Zod + Resend.
4. Lenis + GSAP base (`lib/gsap.ts`, `SmoothScroll`, `matchMedia` de movimento reduzido).
5. Animações seção por seção, na ordem do mapa acima.
6. Esfera do hero com React Three Fiber.
7. SEO, Lighthouse, ajustes finais.

Ao terminar cada etapa: rodar `pnpm lint` e `pnpm build`, e resumir o que foi feito e por quê.
