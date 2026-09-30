import { VelocityMarquee } from "@/components/motion/VelocityMarquee";
import { site } from "@/content/site";

export function TechMarquee() {
  return (
    <section aria-labelledby="tech-title" className="border-y border-line py-10 md:py-14">
      <h2 id="tech-title" className="sr-only">
        Tecnologias
      </h2>
      <VelocityMarquee items={site.tech} />
    </section>
  );
}
