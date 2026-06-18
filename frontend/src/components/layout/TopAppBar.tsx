import { useState } from "react";
import { Icon } from "../ui/Icon";

const NAV_LINKS = [
  { label: "Products", id: "products" },
  { label: "About", id: "about" },
  { label: "Process", id: "process" },
  { label: "Contact", id: "contact" },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function TopAppBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b-[0.5px] border-outline-variant/30 bg-tertiary-container/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-container-max items-center justify-between px-gutter">
        {/* Brand */}
        <button
          onClick={() => scrollTo("home")}
          className="flex items-center gap-base focus-visible:outline-none"
        >
          <Icon name="agriculture" filled className="text-secondary-fixed text-headline-lg-mobile" />
          <span className="font-headline-lg-mobile text-headline-lg-mobile font-bold tracking-tight text-secondary-fixed">
            AgriFetch
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-2 md:flex">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="rounded-lg px-4 py-2 font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-surface-variant/30 hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-fixed/50"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => scrollTo("contact")}
            className="hidden rounded-lg bg-secondary-fixed px-5 py-2 font-label-md text-label-md text-on-secondary-fixed transition-all neon-glow active:scale-95 sm:block"
          >
            Enquire Now
          </button>
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-variant/40 hover:text-on-surface focus-visible:outline-none md:hidden"
          >
            <Icon name={menuOpen ? "close" : "menu"} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="border-t border-outline-variant/20 bg-surface-container/80 px-gutter pb-4 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-1 pt-3">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => { scrollTo(link.id); setMenuOpen(false); }}
                className="rounded-lg px-4 py-3 text-left font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-surface-variant/30 hover:text-on-surface"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => { scrollTo("contact"); setMenuOpen(false); }}
              className="mt-2 rounded-lg bg-secondary-fixed px-4 py-3 font-label-md text-label-md text-on-secondary-fixed neon-glow"
            >
              Enquire Now
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
