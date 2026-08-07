import Image from "next/image";

/**
 * Both files are cropped from `public/logo.png`, whose canvas is ~48% empty
 * transparent padding — rendering it directly makes the artwork half the size
 * of its box and pushes it off-centre. Regenerate these if logo.png changes.
 *
 *   logo-trimmed.png  full lockup, padding removed   1896 x 377
 *   logo-mark.png     the AZ mark only                384 x 377
 */
const LOCKUP = { src: "/logo-trimmed.png", width: 1896, height: 377 };
const MARK = { src: "/logo-mark.png", width: 384, height: 377 };

export function Logo({
  className = "h-auto w-[192px]",
  markOnly = false,
}: {
  className?: string;
  /** Square mark without the wordmark — for the collapsed sidebar. */
  markOnly?: boolean;
}) {
  const { src, width, height } = markOnly ? MARK : LOCKUP;

  return (
    <Image
      src={src}
      alt="Azentra"
      width={width}
      height={height}
      priority
      className={className}
    />
  );
}
