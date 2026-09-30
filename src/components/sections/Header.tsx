import { HeaderShell } from "@/components/motion/HeaderShell";
import { Logo } from "@/components/ui/Logo";
import { site } from "@/content/site";

export function Header() {
  return (
    <HeaderShell>
      <div className="shell flex h-18 items-center justify-between gap-4">
        <a href="#inicio" className="-m-2 inline-flex min-h-11 items-center p-2 text-bone">
          <Logo className="h-6 w-[54px] md:h-7 md:w-[63px]" />
          <span className="sr-only">
            {site.name.first} {site.name.last} — início
          </span>
        </a>

        <nav aria-label="Principal">
          <ul className="flex items-center gap-1 sm:gap-4 md:gap-8">
            {site.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="inline-flex min-h-11 items-center px-1.5 font-mono text-[11px] tracking-[0.08em] text-bone-dim uppercase transition-colors hover:text-bone sm:px-2 sm:text-xs"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <p className="hidden items-center gap-2.5 rounded-full border border-line-strong px-4 py-2 font-mono text-xs tracking-[0.08em] text-bone-dim uppercase lg:flex">
          <span aria-hidden="true" className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-60 motion-reduce:animate-none" />
            <span className="relative size-2 rounded-full bg-accent" />
          </span>
          {site.availability}
        </p>
      </div>
    </HeaderShell>
  );
}
