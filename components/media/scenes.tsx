import type { MediaScene } from "@/data/types";

/**
 * Scene plates.
 *
 * Every image slot on the site renders one of these architectural drawings
 * inside a tonal gradient. They are drawn to read as art direction rather than
 * as missing assets, and they are colour-driven by CSS variables so a single
 * set of drawings works across dusk, night, interior and stone tones.
 *
 * Photography drops in on top of them (see MediaPlate) — nothing here blocks
 * the swap to a CMS-driven image.
 */

const S = {
  line: "var(--s-line)",
  lineSoft: "var(--s-line-soft)",
  fill: "var(--s-fill)",
  fill2: "var(--s-fill-2)",
  light: "var(--s-light)",
  lightSoft: "var(--s-light-soft)",
};

const STAFF = Array.from({ length: 26 }, (_, i) => i);

function Fins({ y, h, step = 64 }: { y: number; h: number; step?: number }) {
  return (
    <g stroke={S.lineSoft} strokeWidth={1}>
      {STAFF.map((i) => (
        <line key={i} x1={i * step} y1={y} x2={i * step} y2={y + h} />
      ))}
    </g>
  );
}

function Windows({
  x,
  y,
  cols,
  rows,
  w,
  h,
  gapX,
  gapY,
  seed = 0,
}: {
  x: number;
  y: number;
  cols: number;
  rows: number;
  w: number;
  h: number;
  gapX: number;
  gapY: number;
  seed?: number;
}) {
  const cells: React.ReactNode[] = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const lit = (r * 7 + c * 13 + seed) % 5 < 2;
      cells.push(
        <rect
          key={`${r}-${c}`}
          x={x + c * gapX}
          y={y + r * gapY}
          width={w}
          height={h}
          fill={lit ? S.light : S.fill2}
          opacity={lit ? 0.55 + ((r + c + seed) % 3) * 0.12 : 0.7}
        />,
      );
    }
  }
  return <g>{cells}</g>;
}

function Canopy({ x, y, r, opacity = 1 }: { x: number; y: number; r: number; opacity?: number }) {
  return (
    <g opacity={opacity} fill={S.fill}>
      <ellipse cx={x} cy={y} rx={r} ry={r * 0.72} />
      <ellipse cx={x - r * 0.5} cy={y + r * 0.2} rx={r * 0.6} ry={r * 0.45} />
      <ellipse cx={x + r * 0.55} cy={y + r * 0.16} rx={r * 0.55} ry={r * 0.4} />
    </g>
  );
}

/* ------------------------------------------------------------------ scenes */

const scene = {
  "tower-dusk": (
    <g>
      <rect x={0} y={704} width={1600} height={2} fill={S.line} opacity={0.5} />
      {/* primary tower */}
      <rect x={210} y={96} width={470} height={610} fill={S.fill} />
      <Fins y={96} h={610} />
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x={210} y={96 + i * 76} width={470} height={6} fill={S.line} opacity={0.5} />
      ))}
      <Windows x={238} y={128} cols={6} rows={7} w={44} h={34} gapX={76} gapY={76} />
      {/* secondary mass */}
      <rect x={740} y={330} width={330} height={376} fill={S.fill} />
      <Fins y={330} h={376} />
      <Windows x={762} y={360} cols={5} rows={5} w={34} h={26} gapX={62} gapY={70} seed={3} />
      {/* podium */}
      <rect x={130} y={640} width={1120} height={66} fill={S.fill} />
      <rect x={130} y={640} width={1120} height={5} fill={S.lineSoft} />
      {/* landscape */}
      <Canopy x={1320} y={620} r={86} />
      <Canopy x={1450} y={660} r={62} />
      <Canopy x={110} y={640} r={70} />
      <rect x={0} y={706} width={1600} height={294} fill="rgba(8,8,8,0.55)" />
      <g stroke={S.lightSoft} strokeWidth={2} opacity={0.5}>
        <line x1={240} y1={760} x2={240} y2={1000} />
        <line x1={670} y1={760} x2={670} y2={1000} />
        <line x1={900} y1={790} x2={900} y2={1000} />
      </g>
    </g>
  ),

  facade: (
    <g>
      <rect x={0} y={0} width={1600} height={1000} fill={S.fill} />
      <Fins y={0} h={1000} step={56} />
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={i} x={0} y={70 + i * 108} width={1600} height={7} fill={S.line} opacity={0.42} />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <rect
          key={`l${i}`}
          x={0}
          y={70 + i * 108 + 7}
          width={1600}
          height={46}
          fill={S.light}
          opacity={i % 3 === 0 ? 0.16 : 0.07}
        />
      ))}
      <path d="M0 1000 L0 300 L520 0 L900 0 L360 1000 Z" fill="rgba(6,6,6,0.34)" />
      <Canopy x={1400} y={932} r={120} opacity={0.9} />
      <Canopy x={1210} y={968} r={90} opacity={0.9} />
    </g>
  ),

  arrival: (
    <g>
      <rect x={0} y={620} width={1600} height={380} fill={S.fill} />
      {/* canopy slab */}
      <rect x={180} y={210} width={1240} height={26} fill={S.fill2} />
      <rect x={180} y={236} width={1240} height={8} fill={S.light} opacity={0.22} />
      {/* colonnade */}
      {Array.from({ length: 7 }, (_, i) => (
        <rect key={i} x={240 + i * 200} y={244} width={26} height={400} fill={S.fill2} />
      ))}
      {Array.from({ length: 7 }, (_, i) => (
        <rect
          key={`c${i}`}
          x={266 + i * 200}
          y={244}
          width={12}
          height={400}
          fill={S.light}
          opacity={0.14}
        />
      ))}
      {/* entry volume */}
      <rect x={700} y={300} width={300} height={344} fill="rgba(4,4,4,0.5)" />
      <rect x={740} y={380} width={220} height={264} fill={S.light} opacity={0.18} />
      {/* drive */}
      <g stroke={S.lineSoft} strokeWidth={2} opacity={0.7}>
        <line x1={820} y1={646} x2={420} y2={1000} />
        <line x1={860} y1={646} x2={1240} y2={1000} />
        <line x1={172} y1={900} x2={1440} y2={900} />
      </g>
      <rect x={0} y={640} width={420} height={10} fill={S.lineSoft} />
      <Canopy x={1450} y={600} r={100} />
      <Canopy x={120} y={620} r={78} />
    </g>
  ),

  lobby: (
    <g>
      {/* converging perspective */}
      <path d="M0 1000 L600 430 L1000 430 L1600 1000 Z" fill="rgba(6,6,6,0.4)" />
      <path d="M0 0 L600 400 L1000 400 L1600 0 Z" fill="rgba(18,18,17,0.5)" />
      <rect x={600} y={400} width={400} height={30} fill={S.fill2} />
      <rect x={600} y={430} width={400} height={10} fill={S.light} opacity={0.2} />
      {/* columns */}
      {[220, 420, 1180, 1380].map((x, i) => (
        <rect key={i} x={x} y={i < 2 ? 150 : 150} width={54} height={620} fill={S.fill2} />
      ))}
      {[274, 474, 1234, 1434].map((x, i) => (
        <rect key={`h${i}`} x={x} y={150} width={12} height={620} fill={S.light} opacity={0.12} />
      ))}
      {/* reception */}
      <rect x={690} y={620} width={320} height={70} fill={S.fill2} />
      <rect x={690} y={620} width={320} height={6} fill={S.light} opacity={0.3} />
      {/* ceiling light band */}
      <rect x={520} y={300} width={560} height={4} fill={S.light} opacity={0.4} />
      <path d="M560 304 L1040 304 L900 430 L700 430 Z" fill={S.light} opacity={0.08} />
      <rect x={0} y={930} width={1000} height={4} fill={S.line} opacity={0.25} />
      <rect x={1120} y={930} width={480} height={4} fill={S.line} opacity={0.25} />
    </g>
  ),

  "interior-living": (
    <g>
      <rect x={0} y={0} width={1600} height={1000} fill={S.fill} />
      {/* window wall */}
      <rect x={840} y={110} width={700} height={640} fill={S.light} opacity={0.28} />
      <g stroke={S.line} strokeWidth={3} opacity={0.7}>
        <line x1={1010} y1={110} x2={1010} y2={750} />
        <line x1={1190} y1={110} x2={1190} y2={750} />
        <line x1={1380} y1={110} x2={1380} y2={750} />
        <line x1={840} y1={430} x2={1540} y2={430} />
      </g>
      {/* far wall */}
      <rect x={0} y={0} width={840} height={1000} fill="rgba(6,6,6,0.35)" />
      <rect x={0} y={690} width={1600} height={310} fill="rgba(14,13,12,0.7)" />
      {/* rug */}
      <rect x={300} y={800} width={900} height={150} fill={S.fill2} opacity={0.55} />
      {/* sofa */}
      <rect x={520} y={650} width={620} height={120} fill={S.fill2} />
      <rect x={520} y={650} width={620} height={18} fill={S.lineSoft} opacity={0.6} />
      <rect x={560} y={620} width={250} height={40} fill={S.fill2} />
      {/* coffee table */}
      <rect x={700} y={790} width={230} height={16} fill={S.fill2} />
      <rect x={720} y={806} width={6} height={44} fill={S.fill2} />
      <rect x={904} y={806} width={6} height={44} fill={S.fill2} />
      {/* pendant + plant */}
      <circle cx={430} cy={330} r={26} fill={S.light} opacity={0.55} />
      <line x1={430} y1={0} x2={430} y2={304} stroke={S.line} strokeWidth={2} />
      <rect x={180} y={700} width={70} height={90} fill={S.fill2} />
      <Canopy x={215} y={650} r={80} />
    </g>
  ),

  "interior-dining": (
    <g>
      <rect x={0} y={0} width={1600} height={1000} fill={S.fill} />
      <rect x={0} y={0} width={1600} height={420} fill="rgba(8,8,7,0.4)" />
      {/* backlit screen */}
      <rect x={1140} y={150} width={420} height={620} fill={S.light} opacity={0.2} />
      <rect x={1140} y={150} width={420} height={620} fill="none" stroke={S.line} strokeWidth={3} />
      {/* pendants */}
      {[520, 700, 880].map((x, i) => (
        <g key={i}>
          <line x1={x} y1={0} x2={x} y2={330} stroke={S.line} strokeWidth={2} opacity={0.7} />
          <rect x={x - 34} y={330} width={68} height={30} fill={S.fill2} />
          <rect x={x - 30} y={360} width={60} height={6} fill={S.light} opacity={0.7} />
        </g>
      ))}
      {/* table */}
      <rect x={380} y={700} width={740} height={20} fill={S.fill2} />
      <rect x={380} y={700} width={740} height={6} fill={S.lineSoft} opacity={0.7} />
      <rect x={430} y={720} width={16} height={130} fill={S.fill2} />
      <rect x={1054} y={720} width={16} height={130} fill={S.fill2} />
      {/* chairs */}
      {Array.from({ length: 4 }, (_, i) => (
        <g key={`c${i}`}>
          <rect x={470 + i * 170} y={630} width={70} height={12} fill={S.fill2} />
          <rect x={480 + i * 170} y={584} width={6} height={48} fill={S.fill2} />
        </g>
      ))}
      {Array.from({ length: 4 }, (_, i) => (
        <rect key={`d${i}`} x={470 + i * 170} y={752} width={70} height={10} fill={S.fill2} />
      ))}
      <rect x={0} y={880} width={1600} height={120} fill="rgba(10,10,9,0.6)" />
    </g>
  ),

  "material-stone": (
    <g>
      <rect x={0} y={0} width={1600} height={1000} fill={S.fill} />
      {Array.from({ length: 7 }, (_, row) =>
        Array.from({ length: 6 }, (_, col) => (
          <rect
            key={`${row}-${col}`}
            x={col * 280 + (row % 2 ? -90 : 0)}
            y={row * 145}
            width={276}
            height={140}
            fill={S.fill2}
            opacity={0.35 + ((row + col) % 3) * 0.14}
          />
        )),
      )}
      <g stroke={S.lineSoft} strokeWidth={2} opacity={0.5}>
        {Array.from({ length: 7 }, (_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 145} x2={1600} y2={i * 145} />
        ))}
      </g>
      <path
        d="M-20 820 C 320 760 520 880 700 840 C 900 796 1180 720 1620 780"
        fill="none"
        stroke={S.line}
        strokeWidth={3}
        opacity={0.55}
      />
      <path d="M0 0 L1600 0 L1200 380 L360 300 Z" fill="rgba(6,6,6,0.36)" />
      <rect x={0} y={900} width={1600} height={100} fill="rgba(8,8,8,0.5)" />
    </g>
  ),

  "pool-deck": (
    <g>
      <rect x={0} y={0} width={1600} height={1000} fill={S.fill} />
      <rect x={0} y={470} width={1600} height={530} fill="rgba(10,14,16,0.75)" />
      <rect x={0} y={470} width={1600} height={4} fill={S.line} opacity={0.6} />
      {/* water */}
      <rect x={0} y={474} width={1600} height={280} fill="rgba(18,26,30,0.6)" />
      <g stroke={S.lineSoft} strokeWidth={2} opacity={0.3}>
        {Array.from({ length: 9 }, (_, i) => (
          <line key={i} x1={0} y1={510 + i * 28} x2={1600} y2={510 + i * 28} />
        ))}
      </g>
      <Canopy x={1420} y={470} r={110} />
      <Canopy x={150} y={470} r={90} />
      {/* deck */}
      <rect x={0} y={754} width={1600} height={246} fill="rgba(8,8,8,0.7)" />
      <g stroke={S.lineSoft} strokeWidth={2} opacity={0.4}>
        {Array.from({ length: 8 }, (_, i) => (
          <line key={i} x1={i * 220} y1={754} x2={i * 220 - 120} y2={1000} />
        ))}
      </g>
      {/* loungers */}
      {[220, 660, 1100].map((x, i) => (
        <g key={i}>
          <rect x={x} y={800} width={130} height={16} fill={S.fill2} />
          <rect x={x + 96} y={770} width={34} height={32} fill={S.fill2} />
        </g>
      ))}
      <rect x={0} y={0} width={1600} height={470} fill="rgba(12,12,11,0.3)" />
    </g>
  ),

  "garden-terrace": (
    <g>
      <rect x={0} y={0} width={1600} height={1000} fill={S.fill} />
      <rect x={0} y={0} width={1600} height={420} fill="rgba(10,12,10,0.5)" />
      {/* paving */}
      <rect x={0} y={560} width={1600} height={440} fill="rgba(12,12,11,0.55)" />
      <g stroke={S.lineSoft} strokeWidth={2} opacity={0.35}>
        {Array.from({ length: 10 }, (_, i) => (
          <line key={`h${i}`} x1={0} y1={560 + i * 48} x2={1600} y2={560 + i * 48} />
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <line key={`v${i}`} x1={i * 150} y1={560} x2={i * 150} y2={1000} />
        ))}
      </g>
      {/* planting beds */}
      <path d="M0 520 C 260 470 520 540 760 500 C 1000 460 1300 520 1600 470 L1600 560 L0 560 Z" fill={S.fill} />
      <Canopy x={260} y={470} r={120} />
      <Canopy x={560} y={500} r={90} />
      <Canopy x={900} y={470} r={140} />
      <Canopy x={1300} y={490} r={110} />
      <Canopy x={1540} y={520} r={130} />
      {/* pergola */}
      <g stroke={S.fill2} strokeWidth={14} opacity={0.9}>
        <line x1={1140} y1={210} x2={1560} y2={210} />
        <line x1={1180} y1={210} x2={1180} y2={560} />
        <line x1={1520} y1={210} x2={1520} y2={560} />
      </g>
      <g stroke={S.line} strokeWidth={3} opacity={0.5}>
        {Array.from({ length: 8 }, (_, i) => (
          <line key={`p${i}`} x1={1160 + i * 54} y1={210} x2={1160 + i * 54} y2={250} />
        ))}
      </g>
    </g>
  ),

  library: (
    <g>
      <rect x={0} y={0} width={1600} height={1000} fill={S.fill} />
      {/* shelving */}
      <rect x={120} y={120} width={620} height={640} fill="rgba(6,6,6,0.5)" />
      <g stroke={S.lineSoft} strokeWidth={3} opacity={0.6}>
        {Array.from({ length: 6 }, (_, i) => (
          <line key={i} x1={120} y1={120 + i * 128} x2={740} y2={120 + i * 128} />
        ))}
        <line x1={430} y1={120} x2={430} y2={760} />
      </g>
      {Array.from({ length: 5 }, (_, r) =>
        Array.from({ length: 9 }, (_, c) => (
          <rect
            key={`${r}-${c}`}
            x={132 + c * 68}
            y={132 + r * 128}
            width={52}
            height={104}
            fill={S.fill2}
            opacity={0.35 + ((r + c) % 4) * 0.12}
          />
        )),
      )}
      {/* window slit */}
      <rect x={900} y={120} width={420} height={640} fill={S.light} opacity={0.16} />
      <rect x={900} y={120} width={420} height={640} fill="none" stroke={S.line} strokeWidth={4} />
      {/* table + lamp */}
      <rect x={300} y={840} width={620} height={20} fill={S.fill2} />
      <rect x={340} y={860} width={16} height={100} fill={S.fill2} />
      <rect x={864} y={860} width={16} height={100} fill={S.fill2} />
      <circle cx={690} cy={700} r={34} fill={S.light} opacity={0.5} />
      <line x1={690} y1={760} x2={690} y2={840} stroke={S.line} strokeWidth={3} />
      <rect x={0} y={0} width={1600} height={1000} fill="rgba(10,9,8,0.28)" />
    </g>
  ),

  aerial: (
    <g>
      <rect x={0} y={0} width={1600} height={1000} fill={S.fill} />
      {/* road diagonals */}
      <path d="M-40 780 L1640 300" stroke={S.lineSoft} strokeWidth={16} fill="none" opacity={0.5} />
      <path d="M-40 780 L1640 300" stroke={S.line} strokeWidth={2} fill="none" opacity={0.5} />
      <path d="M420 -40 L1180 1040" stroke={S.lineSoft} strokeWidth={8} fill="none" opacity={0.35} />
      {/* blocks */}
      {Array.from({ length: 7 }, (_, i) =>
        Array.from({ length: 5 }, (_, j) => (
          <rect
            key={`${i}-${j}`}
            x={80 + i * 220 + (j % 2) * 40}
            y={110 + j * 190}
            width={150}
            height={120}
            fill={S.fill2}
            opacity={0.22 + ((i + j) % 3) * 0.1}
          />
        )),
      )}
      {/* project footprint */}
      <g>
        <rect x={620} y={330} width={390} height={270} fill="rgba(4,4,4,0.6)" />
        <rect x={640} y={350} width={150} height={230} fill={S.fill2} opacity={0.85} />
        <rect x={820} y={380} width={170} height={200} fill={S.fill2} opacity={0.7} />
        <rect x={560} y={610} width={510} height={16} fill={S.line} opacity={0.3} />
      </g>
      <Canopy x={1120} y={700} r={150} />
      <Canopy x={1400} y={420} r={190} />
      <Canopy x={200} y={700} r={130} />
      <rect x={0} y={840} width={1600} height={160} fill="rgba(8,8,8,0.5)" />
    </g>
  ),

  "night-skyline": (
    <g>
      <rect x={0} y={0} width={1600} height={1000} fill={S.fill} />
      {/* layered skyline */}
      <rect x={0} y={560} width={1600} height={440} fill="rgba(6,7,10,0.75)" />
      {Array.from({ length: 16 }, (_, i) => {
        const w = 60 + ((i * 37) % 90);
        const h = 180 + ((i * 61) % 340);
        return (
          <rect
            key={i}
            x={i * 102 - 30}
            y={1000 - h - 180}
            width={w}
            height={h}
            fill={S.fill2}
            opacity={0.6}
          />
        );
      })}
      {Array.from({ length: 16 }, (_, i) => {
        const w = 60 + ((i * 37) % 90);
        const h = 180 + ((i * 61) % 340);
        const y = 1000 - h - 180;
        return Array.from({ length: Math.floor(h / 46) }, (_, r) =>
          Array.from({ length: Math.max(1, Math.floor(w / 34)) }, (_, c) => {
            const lit = (i * 5 + r * 3 + c) % 4 < 2;
            return (
              <rect
                key={`${i}-${r}-${c}`}
                x={i * 102 - 30 + 8 + c * 34}
                y={y + 14 + r * 46}
                width={18}
                height={12}
                fill={S.light}
                opacity={lit ? 0.36 + ((r + c) % 3) * 0.16 : 0.05}
              />
            );
          }),
        );
      })}
      <rect x={0} y={520} width={1600} height={60} fill={S.light} opacity={0.05} />
      <rect x={0} y={0} width={1600} height={300} fill="rgba(4,5,8,0.6)" />
      {/* foreground parapet */}
      <rect x={0} y={870} width={1600} height={130} fill="rgba(5,5,5,0.85)" />
      <rect x={0} y={866} width={1600} height={6} fill={S.line} opacity={0.35} />
    </g>
  ),
} satisfies Record<MediaScene, React.ReactNode>;

export function SceneLayer({ scene: name }: { scene: MediaScene }) {
  return (
    <g>
      <g className="opacity-90">{scene[name]}</g>
    </g>
  );
}
