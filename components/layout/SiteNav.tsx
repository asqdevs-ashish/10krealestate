"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { brand, nav } from "@/data/brand";
import { cn } from "@/lib/format";
import { useLockBodyScroll, useScrollToId } from "@/lib/motion";
import { Action } from "@/components/ui/Action";
import { Wordmark } from "@/components/ui/Wordmark";

/**
 * Editorial navigation: transparent over the hero, then a quiet blurred bar.
 * Hides on downward scroll, returns on the first upward movement.
 */
export function SiteNav() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const scrollToId = useScrollToId();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useLockBodyScroll(menuOpen);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 24);
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? Math.min(1, y / max) : 0);
        if (!menuOpen) {
          const goingDown = y > lastY.current + 6;
          const goingUp = y < lastY.current - 6;
          if (goingDown && y > 520) setHidden(true);
          else if (goingUp || y < 200) setHidden(false);
        }
        lastY.current = y;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [menuOpen]);

  // Active section tracking on the home page.
  useEffect(() => {
    if (pathname !== "/") {
      setActive(null);
      return;
    }
    const ids = ["residences", "experience", "location"];
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!elements.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.2, 0.6] },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const handleNavClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!href.includes("#")) return;
      const [target, hash] = href.split("#");
      if (target === "" || target === pathname) {
        event.preventDefault();
        setMenuOpen(false);
        window.setTimeout(() => scrollToId(hash), menuOpen ? 420 : 0);
      }
    },
    [pathname, scrollToId, menuOpen],
  );

  return (
    <>
      <a
        href="#main"            className="u-label sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[95] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>

      <motion.header
        data-tone="light"
        className={cn(
          "fixed inset-x-0 top-0 z-[70] transition-[background-color,backdrop-filter,border-color] duration-700",
          scrolled
            ? "border-b border-hair bg-paper/85 backdrop-blur-xl supports-[backdrop-filter]:bg-paper/70"
            : "border-b border-transparent bg-transparent",
        )}
        animate={{ y: hidden && !menuOpen ? "-104%" : "0%" }}
        transition={{ duration: reduce ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className={cn(
            "mx-auto flex w-full max-w-[110rem] items-center justify-between px-6 transition-[padding] duration-700 md:px-10",
            scrolled ? "py-4 md:py-5" : "py-6 md:py-8",
          )}
        >
          <Link
            href="/"
            aria-label={`${brand.name} — home`}
            className="relative z-10 -m-2 p-2"
            onClick={() => setMenuOpen(false)}
          >
            <Wordmark size={scrolled ? "sm" : "md"} />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-10 lg:flex">
            {nav.map((item) => {
              const isActive = active === item.href.replace("/", "");
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={(event) => handleNavClick(event, item.href)}
                  className="group relative py-1"
                  aria-current={isActive ? "true" : undefined}
                >
                  <span
                    className={cn(
                      "u-label transition-colors duration-500",
                      isActive ? "text-text" : "text-text/60 group-hover:text-text",
                    )}
                  >
                    {item.label}
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      "absolute -bottom-0.5 left-0 h-px bg-accent transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      isActive ? "w-full" : "w-0 group-hover:w-full",
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <Action href="/book-a-viewing" variant="ghost" size="sm" arrow>
                Schedule a Viewing
              </Action>
            </div>

            <button
              ref={toggleRef}
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((open) => !open)}
              className="relative z-10 flex h-11 w-11 items-center justify-center lg:hidden"
            >
              <span className="relative block h-3 w-6">
                <span
                  className={cn(
                    "absolute left-0 block h-px w-6 bg-text transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    menuOpen ? "top-1.5 rotate-45" : "top-0",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 block h-px bg-text transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    menuOpen ? "top-1.5 w-6 -rotate-45" : "top-3 w-4",
                  )}
                />
              </span>
            </button>
          </div>
        </div>

        <div aria-hidden className="relative h-px w-full bg-hair">
          <span
            className="absolute inset-y-0 left-0 block bg-accent/70 transition-[width] duration-150"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-menu"
            data-tone="light"
            className="fixed inset-0 z-[68] flex flex-col justify-between bg-paper px-6 pt-28 pb-10 lg:hidden"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <nav aria-label="Mobile" className="flex flex-col">
              {nav.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.06 * i + 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="border-b border-hair"
                >
                  <Link
                    href={item.href}
                    onClick={(event) => handleNavClick(event, item.href)}
                    className="flex items-baseline justify-between py-5"
                  >
                    <span className="font-display text-[2.1rem] leading-none text-text">
                      {item.label}
                    </span>
                    <span className="u-label text-faint">{`0${i + 1}`}</span>
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.36, ease: [0.16, 1, 0.3, 1] }}
                className="border-b border-hair"
              >
                <Link href="/availability" className="flex items-baseline justify-between py-5">
                  <span className="font-display text-[2.1rem] leading-none text-text">
                    Availability
                  </span>
                  <span className="u-label text-faint">05</span>
                </Link>
              </motion.div>
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.42 }}
              className="flex flex-col gap-6"
            >
              <Action href="/book-a-viewing" variant="primary" size="lg" arrow>
                Schedule a Private Viewing
              </Action>
              <div className="flex flex-col gap-2">
                <a href={`tel:${brand.contact.phoneHref}`} className="u-label text-text/60">
                  {brand.contact.phone}
                </a>
                <a href={`mailto:${brand.contact.email}`} className="u-label text-text/60">
                  {brand.contact.email}
                </a>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
