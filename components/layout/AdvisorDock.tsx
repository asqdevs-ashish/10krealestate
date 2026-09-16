"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { brand } from "@/data/brand";
import { buildWhatsAppMessage, telHref, whatsappUrl } from "@/lib/whatsapp";

/**
 * Desktop conversion cluster — deliberately small, bottom right, and it steps
 * out of the way once the footer is on screen.
 */
export function AdvisorDock() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const footer = document.getElementById("site-footer");
    let nearFooter = false;
    const onScroll = () => {
      const pastHero = window.scrollY > window.innerHeight * 0.85;
      setVisible(pastHero && !nearFooter);
    };
    const observer = footer
      ? new IntersectionObserver(
          (entries) => {
            nearFooter = entries[0]?.isIntersecting ?? false;
            onScroll();
          },
          { rootMargin: "0px 0px -20% 0px" },
        )
      : null;
    if (footer && observer) observer.observe(footer);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
    };
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed right-8 bottom-8 z-[76] hidden md:block"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          onPointerEnter={() => setOpen(true)}
          onPointerLeave={() => setOpen(false)}
          onFocusCapture={() => setOpen(true)}
          onBlurCapture={() => setOpen(false)}
        >
          <div
            data-tone="light"
            className="flex items-center gap-3 border border-hair bg-paper/90 px-4 py-3 backdrop-blur-xl"
          >
            <span aria-hidden className="relative flex h-1.5 w-1.5">
              <span className="u-pulse-ring absolute inset-0 rounded-full bg-accent" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            <span className="u-label text-text/75">Speak with an advisor</span>
            <motion.div
              className="flex items-center gap-4 overflow-hidden"
              animate={{ width: open ? "auto" : 0, opacity: open ? 1 : 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span aria-hidden className="h-3 w-px bg-hair" />
              <a
                href={whatsappUrl(buildWhatsAppMessage({ intent: "advisor" }))}
                target="_blank"
                rel="noopener noreferrer"
                className="u-label whitespace-nowrap text-text/80 transition-colors duration-500 hover:text-accent-2"
              >
                WhatsApp
              </a>
              <a
                href={telHref(brand.contact.phoneHref)}
                className="u-label whitespace-nowrap text-text/80 transition-colors duration-500 hover:text-accent-2"
              >
                Call
              </a>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
