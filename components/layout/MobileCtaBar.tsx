"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { brand } from "@/data/brand";
import { buildWhatsAppMessage, telHref, whatsappUrl } from "@/lib/whatsapp";

function Icon({ name }: { name: "whatsapp" | "phone" | "calendar" }) {
  if (name === "whatsapp") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
        <path
          d="M21 11.6c0 4.5-3.9 8.1-8.7 8.1-1.4 0-2.7-.3-3.8-.9L4 20.5l1.4-4c-.7-1.1-1.1-2.4-1.1-3.8C4.3 7.1 8.2 3.5 13 3.5s8 3.6 8 8.1Z"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />
        <path
          d="M9.6 9.1c.3-.6.6-.5 1.1-.5.4 0 .6.2.8.7l.4 1c.1.4 0 .7-.3 1l-.4.4c-.2.2-.2.4-.1.6.4.7 1.1 1.4 1.8 1.8.2.1.5.1.6-.1l.4-.4c.3-.3.6-.4 1-.3l1 .4c.5.2.7.4.7.8 0 .5 0 .8-.5 1.1-.6.4-1.3.5-2.2.2-1.9-.7-3.7-2.4-4.4-4.3-.3-.9-.2-1.6.1-2.2Z"
          fill="currentColor"
        />
      </svg>
    );
  }
  if (name === "phone") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
        <path
          d="M6.5 3.5 9 8l-1.6 1.9c-.3.4-.3.9-.1 1.3a13 13 0 0 0 5.5 5.5c.4.2.9.2 1.3-.1L16 15l4.5 2.5-1 2.2c-.3.7-1 1-1.8 1A15.6 15.6 0 0 1 3.3 6.3c0-.8.4-1.5 1-1.8l2.2-1Z"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
      <rect x="3.5" y="5" width="17" height="15.5" stroke="currentColor" strokeWidth="1.1" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

export function MobileCtaBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hidden = pathname === "/book-a-viewing";

  return (
    <AnimatePresence>
      {visible && !hidden ? (
        <motion.div
          data-tone="light"
          className="fixed inset-x-0 bottom-0 z-[75] border-t border-hair bg-paper/90 backdrop-blur-xl md:hidden"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          initial={{ y: "110%" }}
          animate={{ y: "0%" }}
          exit={{ y: "110%" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="grid grid-cols-3 divide-x divide-hair">
            <a
              href={whatsappUrl(buildWhatsAppMessage({ intent: "advisor" }))}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1.5 py-3.5 text-text/85 active:bg-ink/5"
            >
              <Icon name="whatsapp" />
              <span className="u-label text-[0.5625rem] text-text/70">WhatsApp</span>
            </a>
            <a
              href={telHref(brand.contact.phoneHref)}
              className="flex flex-col items-center gap-1.5 py-3.5 text-text/85 active:bg-ink/5"
            >
              <Icon name="phone" />
              <span className="u-label text-[0.5625rem] text-text/70">Call</span>
            </a>
            <Link
              href="/book-a-viewing"
              className="flex flex-col items-center gap-1.5 bg-accent py-3.5 text-paper active:bg-accent-2"
            >
              <Icon name="calendar" />
              <span className="u-label text-[0.5625rem]">Schedule</span>
            </Link>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
