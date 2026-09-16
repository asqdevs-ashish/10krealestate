import type { ReactNode } from "react";
import type { UnitStatus } from "@/data/types";
import { STATUS_COLOR, STATUS_LABEL } from "@/data/brand";
import { cn } from "@/lib/format";

export function Eyebrow({
  index,
  children,
  tone = "dark",
  className,
}: {
  index?: string;
  children: ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <div className={cn("flex items-baseline gap-3", className)}>
      {index ? (
        <span className="u-label text-accent">{index}</span>
      ) : (
        <span aria-hidden className={cn("h-px w-6", tone === "dark" ? "bg-hair-strong" : "bg-hair")} />
      )}
      <span className={cn("u-label", tone === "dark" ? "text-dim" : "text-dim")}>
        {children}
      </span>
    </div>
  );
}

export function Meta({
  label,
  value,
  sub,
  tone = "dark",
  className,
}: {
  label: string;
  value: ReactNode;
  sub?: string;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <span className={cn("u-label", tone === "dark" ? "text-faint" : "text-dim")}>
        {label}
      </span>
      <span
        className={cn(
          "u-num text-sm",
          tone === "dark" ? "text-text/90" : "text-text",
        )}
      >
        {value}
      </span>
      {sub ? (
        <span className={cn("text-xs", tone === "dark" ? "text-dim" : "text-dim")}>
          {sub}
        </span>
      ) : null}
    </div>
  );
}

export function StatusDot({ status }: { status: UnitStatus }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: STATUS_COLOR[status] }}
      />
      <span className="u-label text-text/75">{STATUS_LABEL[status]}</span>
    </span>
  );
}

/** Hairline-bordered metadata block used across editorial sections. */
export function StatBlock({
  items,
  tone = "dark",
  className,
}: {
  items: { value: string; label: string; sub?: string }[];
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <dl
      className={cn(
        "grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4",
        tone === "dark" ? "border-hair" : "border-hair",
        className,
      )}
    >
      {items.map((item) => (
        <div
          key={item.label}
          className={cn(
            "border-t pt-5",
            tone === "dark" ? "border-hair" : "border-hair",
          )}
        >
          <dt className={cn("u-label", tone === "dark" ? "text-dim" : "text-dim")}>
            {item.label}
          </dt>
          <dd
            className={cn(
              "mt-3 font-display text-[clamp(1.75rem,3.4vw,2.75rem)] leading-none",
              tone === "dark" ? "text-text" : "text-text",
            )}
          >
            {item.value}
          </dd>
          {item.sub ? (
            <p className={cn("mt-3 max-w-[22ch] text-xs", tone === "dark" ? "text-dim" : "text-dim")}>
              {item.sub}
            </p>
          ) : null}
        </div>
      ))}
    </dl>
  );
}
