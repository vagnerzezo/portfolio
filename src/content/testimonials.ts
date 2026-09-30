import type { Testimonial } from "@/types/content";

// Apenas depoimentos reais, com autorização de quem escreveu.
export const testimonials: Testimonial[] = [
  {
    quote:
      "Vagner é, sem dúvida, um profissional excepcional e uma pessoa admirável. Possui uma habilidade única de colaborar em equipe, demonstrando empatia, liderança e comprometimento em cada projeto que realiza.",
    author: "Filipe Moura da Silva",
    role: "Comercial",
    company: "SKA",
    avatar: { src: "/images/filipe.webp", alt: "Foto de Filipe Moura da Silva", width: 320, height: 320 },
  },
  {
    quote:
      "O Zezo é um dos profissionais mais dedicados e talentosos que já conheci. Como empresa, a Agliardi, e eu pessoalmente, somos imensamente gratos por todo o seu desempenho e engajamento que coloca em tudo que faz.",
    author: "Lucas Agliardi",
    role: "CEO e Fundador",
    company: "Agliardi e Manux Headless",
    avatar: { src: "/images/lucas.webp", alt: "Foto de Lucas Agliardi", width: 320, height: 320 },
  },
];
