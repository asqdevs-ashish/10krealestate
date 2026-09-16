/**
 * Third-party console notice filter.
 *
 * `three` r186 deprecates `THREE.Clock` in favour of `THREE.Timer`, and
 * @react-three/fiber (9.7, current) still constructs one when it builds its
 * render store — so a single deprecation line appears the first time a WebGL
 * scene mounts, with nothing we can act on from application code.
 *
 * This silences that one message and nothing else. The original is restored as
 * soon as the scene unmounts, so it is not a blanket console patch — and it is
 * deliberately the only place the site touches a global.
 */
const NOTICE = "THREE.Clock";

export function silenceThreeClockNotice(): () => void {
  if (typeof window === "undefined") return () => {};

  const original = console.warn;
  console.warn = (...args: unknown[]) => {
    const first = args[0];
    if (typeof first === "string" && first.startsWith(NOTICE)) return;
    original(...args);
  };

  return () => {
    console.warn = original;
  };
}
