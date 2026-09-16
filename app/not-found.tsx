import { Eyebrow } from "@/components/ui/Label";
import { Action } from "@/components/ui/Action";
import { DisplayLines, Reveal } from "@/components/motion/Reveal";

export default function NotFound() {
  return (
    <section data-tone="light" className="relative flex min-h-[80svh] items-center bg-paper pt-32 pb-24">
      <div className="mx-auto w-full max-w-[110rem] px-6 md:px-10">
        <div className="grid gap-12 xl:grid-cols-12">
          <div className="xl:col-span-7">
            <Eyebrow index="404">Not found</Eyebrow>
            <DisplayLines
              as="h1"
              animateOnMount
              lines={["This address", "doesn't exist."]}
              className="u-display mt-8 text-[clamp(2.2rem,6vw,4.75rem)] text-text"
            />
            <Reveal delay={0.15} className="mt-8 max-w-[46ch] text-sm leading-relaxed text-dim">
              <p>
                The page you were looking for has moved, or was never built. The residence list is
                the best place to pick up the thread.
              </p>
            </Reveal>
            <div className="mt-10 flex flex-wrap gap-4">
              <Action href="/" variant="primary" arrow>
                Back to VAULT
              </Action>
              <Action href="/availability" variant="ghost">
                View availability
              </Action>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
