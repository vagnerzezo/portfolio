import Image from "next/image";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { HeroSphereLoader } from "@/components/three/HeroSphereLoader";
import { SphereFallback } from "@/components/three/SphereFallback";
import { site } from "@/content/site";

export function Hero() {
  return (
    <section
      id="inicio"
      aria-labelledby="hero-title"
      className="relative flex min-h-dvh flex-col justify-end overflow-hidden pt-28 pb-10 md:pb-14"
    >
      <div className="pointer-events-none absolute top-1/2 right-[-6%] hidden aspect-square w-[min(50vw,90dvh,760px)] -translate-y-1/2 md:block">
        <HeroSphereLoader triggerId="inicio" fallback={<SphereFallback className="size-full" />} />
      </div>

      <div className="shell relative grid gap-12 md:gap-16">
        <SplitReveal>
          <h1
            id="hero-title"
            className="font-display text-[clamp(4.75rem,17vw,15rem)] leading-[0.86] tracking-[-0.025em]"
          >
            <span className="block">{site.name.first}</span>{" "}
            <span className="block pl-[0.6em] italic">
              {site.name.last}
              <span className="text-accent">.</span>
            </span>
          </h1>
        </SplitReveal>

        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-md items-center gap-5">
            <Image
              src={site.avatar.src}
              alt={site.avatar.alt}
              width={site.avatar.width}
              height={site.avatar.height}
              sizes="64px"
              loading="eager"
              className="size-16 shrink-0 rounded-full object-cover grayscale"
            />
            <p className="text-lg leading-relaxed text-bone-dim">{site.intro}</p>
          </div>

          <p className="section-label flex items-center gap-3">
            Role para explorar
            <span aria-hidden="true" className="inline-block animate-bounce motion-reduce:animate-none">
              ↓
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
