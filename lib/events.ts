import type { Configuration } from "@/data/types";

/**
 * Cross-section bridge.
 *
 * Lets one section hand a selection to another without lifting state into the
 * page — e.g. the residence explorer asking the floor-plan viewer to open a
 * configuration. Kept deliberately tiny; a real app would use a store.
 */

const PLAN_EVENT = "asq:select-plan";

export function selectPlan(configuration: Configuration) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<Configuration>(PLAN_EVENT, { detail: configuration }));
}

export function onSelectPlan(handler: (configuration: Configuration) => void) {
  if (typeof window === "undefined") return () => {};
  const listener = (event: Event) => {
    const detail = (event as CustomEvent<Configuration>).detail;
    if (detail) handler(detail);
  };
  window.addEventListener(PLAN_EVENT, listener);
  return () => window.removeEventListener(PLAN_EVENT, listener);
}
