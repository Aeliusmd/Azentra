"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Tallest a menu may grow before it scrolls internally. */
const MAX_HEIGHT = 280;
/** Gap between the trigger and the menu. */
const GAP = 8;

type Placement = {
  position: "fixed";
  left: number;
  width: number;
  maxHeight: number;
  top?: number;
  bottom?: number;
};

/**
 * Positions a dropdown against its trigger using fixed coordinates.
 *
 * `position: fixed` is resolved against the viewport, so the menu is not
 * clipped by the `overflow-hidden` of an ancestor — without this, a select near
 * the bottom of a modal has its options cut off by the dialog edge. The menu
 * also flips above the trigger when there is more room there.
 *
 * Call `place()` in the handler that opens the menu so the coordinates are
 * ready on the same render the menu first appears.
 */
export function useAnchoredMenu<T extends HTMLElement>(open: boolean) {
  const triggerRef = useRef<T>(null);
  const [style, setStyle] = useState<Placement | null>(null);

  const place = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const below = window.innerHeight - rect.bottom - GAP;
    const above = rect.top - GAP;
    const flipUp = below < Math.min(MAX_HEIGHT, above);

    setStyle({
      position: "fixed",
      left: rect.left,
      width: rect.width,
      maxHeight: Math.min(MAX_HEIGHT, flipUp ? above : below),
      ...(flipUp
        ? { bottom: window.innerHeight - rect.top + GAP }
        : { top: rect.bottom + GAP }),
    });
  }, []);

  useEffect(() => {
    if (!open) return;

    // Capture phase so scrolling any ancestor repositions the menu.
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, place]);

  return { triggerRef, style, place };
}
