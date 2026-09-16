"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/format";
import { useLockBodyScroll } from "@/lib/motion";

/**
 * Accessible dialog: ESC to close, scroll lock, focus moved in and restored,
 * and a simple focus trap so keyboard users stay inside the panel.
 *
 * The panel carries its own `data-tone`, so the semantic tokens inside it
 * resolve against the panel's surface rather than the page behind it.
 */
export function Modal({
  open,
  onClose,
  label,
  children,
  className,
  tone = "light",
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
  className?: string;
  tone?: "dark" | "light";
}) {
  const panel = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;
    restoreTo.current = document.activeElement as HTMLElement | null;
    const timer = window.setTimeout(() => panel.current?.focus(), 60);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panel.current) return;
      const focusable = panel.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", onKeyDown);
      restoreTo.current?.focus?.();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[95] flex items-end justify-center md:items-center">
          <motion.button
            type="button"
            aria-label="Close"
            className="absolute inset-0 cursor-default bg-void/75 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onClose}
          />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            tabIndex={-1}
            data-tone={tone}
            className={cn(
              "relative max-h-[92dvh] w-full overflow-y-auto border border-hair outline-none",
              tone === "dark" ? "bg-ink text-text" : "bg-paper text-text",
              "md:max-w-5xl",
              className,
            )}
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              type="button"
              onClick={onClose}
              className="u-label absolute top-5 right-5 z-10 flex h-9 items-center gap-2 px-3 text-text/60 transition-colors duration-500 hover:text-text"
            >
              Close
              <span aria-hidden className="text-base leading-none">
                ×
              </span>
            </button>
            {children}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
