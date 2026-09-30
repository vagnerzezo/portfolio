import { Accordion } from "@/components/motion/Accordion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { services } from "@/content/services";

export function Services() {
  return (
    <section id="servicos" aria-labelledby="servicos-title" className="scroll-mt-20 py-28 md:py-40">
      <div className="shell grid gap-12 md:gap-16">
        <SectionLabel as="h2" id="servicos-title" index={3}>
          O que eu faço
        </SectionLabel>
        <Accordion items={services} />
      </div>
    </section>
  );
}
