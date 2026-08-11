import { Suspense } from "react";
import type { Metadata } from "next";

import { MyWorkView } from "@/components/tech/my-work/my-work-view";

export const metadata: Metadata = {
  title: "My Work",
};

export default function MyWorkPage() {
  // The view reads `?job=` to open a job handed over from the dashboard.
  return (
    <Suspense fallback={null}>
      <MyWorkView />
    </Suspense>
  );
}
