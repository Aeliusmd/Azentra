/**
 * The square on a visitor pass.
 *
 * This is a *mock* code, not a scannable one: encoding a real QR symbol means
 * Reed-Solomon error correction and a mask-pattern search, which is a library's
 * worth of work for a frontend demonstration. What it does give is a stable
 * one — the same pass id always draws the same square, because the modules come
 * from a hash of the id rather than from chance — with the three finder
 * patterns in place so it reads as what it stands for.
 */

/** Modules across the symbol, matching a real version-2 code. */
const SIZE = 25;
const QUIET = 2;

/** FNV-1a. Deterministic, and spreads single-character changes well. */
function hash(value: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** The 7x7 finder squares sit in three corners and must stay clear. */
function inFinder(row: number, column: number) {
  const near = (r: number, c: number) => r < 8 && c < 8;
  return (
    near(row, column) ||
    near(row, SIZE - 1 - column) ||
    near(SIZE - 1 - row, column)
  );
}

function Finder({ x, y }: { x: number; y: number }) {
  return (
    <>
      <rect x={x} y={y} width={7} height={7} fill="currentColor" />
      <rect x={x + 1} y={y + 1} width={5} height={5} fill="#fff" />
      <rect x={x + 2} y={y + 2} width={3} height={3} fill="currentColor" />
    </>
  );
}

export function ResQrCode({
  value,
  className = "h-40 w-40",
}: {
  /** The pass reference the square stands for. */
  value: string;
  className?: string;
}) {
  const seed = hash(value);
  const modules: { x: number; y: number }[] = [];

  for (let row = 0; row < SIZE; row++) {
    for (let column = 0; column < SIZE; column++) {
      if (inFinder(row, column)) continue;
      // Re-hash per cell so neighbouring cells are not correlated.
      if ((hash(`${seed}:${row}:${column}`) & 1) === 1) {
        modules.push({ x: column, y: row });
      }
    }
  }

  const span = SIZE + QUIET * 2;

  return (
    <svg
      viewBox={`0 0 ${span} ${span}`}
      role="img"
      aria-label={`Visitor pass code for ${value}`}
      className={`${className} text-ink`}
    >
      <rect width={span} height={span} fill="#fff" />
      <g transform={`translate(${QUIET} ${QUIET})`}>
        {modules.map((module) => (
          <rect
            key={`${module.x}-${module.y}`}
            x={module.x}
            y={module.y}
            width={1}
            height={1}
            fill="currentColor"
          />
        ))}
        <Finder x={0} y={0} />
        <Finder x={SIZE - 7} y={0} />
        <Finder x={0} y={SIZE - 7} />
      </g>
    </svg>
  );
}
