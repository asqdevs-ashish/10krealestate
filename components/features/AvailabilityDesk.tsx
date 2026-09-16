"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { listProjects } from "@/data";
import { cn, formatINR, pad2 } from "@/lib/format";
import { Action } from "@/components/ui/Action";
import { AvailabilityTable } from "./AvailabilityTable";

/**
 * Portfolio availability desk.
 *
 * One project at a time, chosen from a quiet tab rail. The inventory table
 * below is the same component the project pages use, so filtering, sorting and
 * the detail sheet behave identically wherever a buyer meets them.
 */
export function AvailabilityDesk() {
  const projects = listProjects();
  const [slug, setSlug] = useState(projects[0]?.slug ?? "");
  const project = useMemo(
    () => projects.find((p) => p.slug === slug) ?? projects[0],
    [projects, slug],
  );

  if (!project) return null;

  const available = project.units.filter((u) => u.status === "available").length;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-end gap-x-8 gap-y-4 border-t border-hair pt-6">
          <div className="flex flex-wrap gap-3">
            {projects.map((option) => {
              const isActive = option.slug === project.slug;
              const open = option.units.filter((u) => u.status === "available").length;
              return (
                <button
                  key={option.slug}
                  type="button"
                  onClick={() => setSlug(option.slug)}
                  aria-pressed={isActive}
                  className={cn(
                    "group flex flex-col items-start gap-1.5 border px-5 py-3.5 text-left transition-colors duration-500",
                    isActive
                      ? "border-accent/60 bg-accent/10"
                      : "border-hair hover:border-hair-strong",
                  )}
                >
                  <span
                    className={cn(
                      "font-display text-[1.15rem] leading-none transition-colors duration-500",
                      isActive ? "text-accent-2" : "text-text/80 group-hover:text-text",
                    )}
                  >
                    {option.name}
                  </span>
                  <span className="u-label text-faint">
                    {pad2(open)} available · {option.locality}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="ml-auto flex flex-col gap-2">
            <span className="u-label text-faint">Updated</span>
            <span className="u-num text-xs text-text/70">
              {available} of {project.units.length} residences open
            </span>
          </div>
        </div>
      </div>

      <AvailabilityTable units={project.units} project={project} />

      <div className="flex flex-wrap items-center justify-between gap-6 border-t border-hair pt-8">
        <p className="u-label max-w-[46ch] text-faint">
          {project.name} · {project.subtitle} · {project.locality} · from{" "}
          {formatINR(project.priceFrom)} · possession {project.possession}
        </p>
        <div className="flex flex-wrap items-center gap-6">
          <Link
            href={`/projects/${project.slug}`}
            className="u-label border-b border-hair-strong pb-0.5 text-text/60 transition-colors duration-500 hover:border-accent/70 hover:text-text"
          >
            Open the {project.name} project page
          </Link>
          <Action href={`/book-a-viewing?project=${project.slug}`} variant="ghost" size="sm" arrow>
            Request the unit sheet
          </Action>
        </div>
      </div>
    </div>
  );
}
