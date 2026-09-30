import Image from "next/image";
import { ClipReveal } from "@/components/motion/ClipReveal";
import { ScrollWordReveal } from "@/components/motion/ScrollWordReveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { site } from "@/content/site";

export function About() {
  const { image, text } = site.about;

  return (
    <section id="sobre" aria-labelledby="sobre-title" className="scroll-mt-20 py-28 md:py-40">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-x-10">
        <SectionLabel as="h2" id="sobre-title" index={1} className="lg:col-span-12">
          Sobre
        </SectionLabel>

        <ClipReveal className="lg:col-span-5">
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="aspect-[4/5] w-full object-cover grayscale"
          />
        </ClipReveal>

        <ScrollWordReveal className="self-center font-display text-[clamp(1.75rem,3.2vw,3.25rem)] leading-[1.12] text-bone lg:col-span-7">
          {text.before}
          <em className="text-accent-text">{text.highlight}</em>
          {text.after}
        </ScrollWordReveal>
      </div>
    </section>
  );
}
