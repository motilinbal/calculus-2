import React, { useState, useMemo } from "react";

/**
 * DarbouxVisualizer – DARK‑MODE REWORK ✨
 * --------------------------------------
 * Same interactive playground, now with first‑class dark‑theme support
 * and higher‑contrast colours.
 *
 * Changes
 * ▸ Theme‑aware text / stroke colours via Tailwind `dark:` variants + `currentColor` in SVG
 * ▸ Brighter semi‑transparent rectangle fills for clarity on dark backgrounds
 * ▸ Numeric read‑outs always legible (`text‑white` in dark)
 * ▸ Minor accessibility tweaks (slider focus ring + aria‑labels)
 */

// Demo functions on [a,b]
const FUNCTIONS = {
  "sin(πx)": { a: 0, b: 1, f: (x) => Math.sin(Math.PI * x) },
  "x²": { a: 0, b: 1, f: (x) => x * x },
  "√x": { a: 0, b: 1, f: (x) => Math.sqrt(x) },
};

export default function DarbouxVisualizer() {
  const [n, setN] = useState(8);               // sub‑interval count
  const [funcKey, setFuncKey] = useState("sin(πx)");
  const { a, b, f } = FUNCTIONS[funcKey];

  // ── Compute sums and geometry ────────────────────────────────────────────
  const { points, rects, upper, lower } = useMemo(() => {
    const dx = (b - a) / n;
    const dense = 501;

    // Curve polyline (smooth enough for display)
    const pts = Array.from({ length: dense }, (_, i) => {
      const x = a + ((b - a) * i) / (dense - 1);
      return { x, y: f(x) };
    });

    // Sub‑interval rectangles  + sums
    let U = 0, L = 0;
    const rs = Array.from({ length: n }, (_, i) => {
      const x0 = a + i * dx;
      const x1 = x0 + dx;
      let m = Infinity, M = -Infinity;
      // 20 evaluation points → local sup / inf
      for (let s = 0; s <= 20; s++) {
        const xs = x0 + ((x1 - x0) * s) / 20;
        const val = f(xs);
        if (val < m) m = val;
        if (val > M) M = val;
      }
      U += M * dx;
      L += m * dx;
      return { x0, x1, m, M };
    });

    return { points: pts, rects: rs, upper: U, lower: L };
  }, [n, funcKey, a, b, f]);

  // ── Scales ───────────────────────────────────────────────────────────────
  const W = 640, H = 420, M = 40;
  const yMax = Math.max(0, ...points.map(p => p.y), ...rects.map(r => r.M));
  const yMin = Math.min(0, ...points.map(p => p.y), ...rects.map(r => r.m));
  const scaleX = x => M + ((x - a) / (b - a)) * (W - 2 * M);
  const scaleY = y => H - M - ((y - yMin) / (yMax - yMin)) * (H - 2 * M);

  // ── JSX ──────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto text-slate-900 dark:text-slate-100">
      <h1 className="text-2xl font-bold">Darboux Integral Visualizer</h1>

      {/* Controls */}
      <div className="flex flex-wrap gap-8 items-end">
        <label className="flex flex-col text-sm w-64">
          <span className="font-medium pb-1">Number of sub‑intervals: {n}</span>
          <input
            aria-label="Sub‑interval slider"
            type="range" min="1" max="120" value={n}
            onChange={e => setN(+e.target.value)}
            className="w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </label>

        <label className="flex flex-col text-sm w-44">
          <span className="font-medium pb-1">Function</span>
          <select
            value={funcKey}
            onChange={e => setFuncKey(e.target.value)}
            className="p-2 border rounded-md bg-white dark:bg-zinc-800 dark:border-zinc-700"
          >
            {Object.keys(FUNCTIONS).map(k => <option key={k}>{k}</option>)}
          </select>
        </label>
      </div>

      {/* Plot */}
      <svg
        width={W}
        height={H}
        className="rounded-xl shadow-md bg-white dark:bg-zinc-900 text-slate-800 dark:text-slate-200"
      >
        {/* Axis */}
        <line
          x1={scaleX(a)} y1={scaleY(0)} x2={scaleX(b)} y2={scaleY(0)}
          stroke="currentColor" strokeWidth="1"
        />

        {/* Function graph */}
        <polyline
          fill="none" stroke="currentColor" strokeWidth="2"
          points={points.map(p => `${scaleX(p.x)},${scaleY(p.y)}`).join(" ")}
        />

        {/* Rectangles */}
        {rects.map((r, i) => {
          const x = scaleX(r.x0);
          const w = scaleX(r.x1) - x;
          return (
            <g key={i}>
              {/* Upper (red) */}
              <rect
                x={x}
                y={scaleY(r.M)}
                width={w}
                height={scaleY(0) - scaleY(r.M)}
                fill="#f87171"                             // rose‑400
                fillOpacity="0.45"
              />
              {/* Lower (blue) */}
              <rect
                x={x}
                y={scaleY(r.m)}
                width={w}
                height={scaleY(0) - scaleY(r.m)}
                fill="#60a5fa"                             // blue‑400
                fillOpacity="0.45"
              />
            </g>
          );
        })}
      </svg>

      {/* Read‑outs */}
      <div className="grid sm:grid-cols-3 gap-4 text-sm">
        <div className="p-3 bg-zinc-200 dark:bg-zinc-800 rounded-lg text-slate-900 dark:text-slate-100">
          <span className="font-medium">Upper sum Uₙ:</span> {upper.toFixed(6)}
        </div>
        <div className="p-3 bg-zinc-200 dark:bg-zinc-800 rounded-lg text-slate-900 dark:text-slate-100">
          <span className="font-medium">Lower sum Lₙ:</span> {lower.toFixed(6)}
        </div>
        <div className="p-3 bg-zinc-200 dark:bg-zinc-800 rounded-lg text-slate-900 dark:text-slate-100">
          <span className="font-medium">Gap Uₙ − Lₙ:</span> {(upper - lower).toFixed(6)}
        </div>
      </div>

      <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-prose">
        Drag the slider to refine the partition. As the mesh size <span className="italic">h</span> → 0,
        the red (upper) and blue (lower) Darboux sums converge if—and only if—the
        function is Riemann integrable.
      </p>
    </div>
  );
}
