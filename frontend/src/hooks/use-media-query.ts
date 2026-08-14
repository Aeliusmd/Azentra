"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Whether a CSS media query currently matches, kept in step with the viewport.
 *
 * Layout belongs in CSS wherever it can be — this is for the cases where the
 * width has to change behaviour rather than styling, such as which calendar
 * view a page opens on. Renders `false` on the server and on the first client
 * paint, so the markup matches before hydration settles.
 */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** Tailwind's `md` breakpoint — below it the layout is a single column. */
export function useIsPhone() {
  return useMediaQuery("(max-width: 767px)");
}
