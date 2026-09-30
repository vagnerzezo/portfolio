import { TestimonialCarousel } from "@/components/motion/TestimonialCarousel";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { testimonials } from "@/content/testimonials";

export function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <section id="depoimentos" aria-labelledby="depoimentos-title" className="scroll-mt-20 bg-ink-850 py-28 md:py-40">
      <div className="shell">
        {/* O cabeçalho é renderizado no servidor e entra no carrossel (client) como children. */}
        <TestimonialCarousel items={testimonials}>
          <div className="grid content-start gap-8">
            <SectionLabel index={6}>Depoimentos</SectionLabel>
            <h2
              id="depoimentos-title"
              className="font-display text-[clamp(3rem,6vw,5rem)] leading-[0.95] tracking-[-0.02em]"
            >
              Quem já <em>trabalhou comigo</em>
            </h2>
          </div>
        </TestimonialCarousel>
      </div>
    </section>
  );
}
