import { Suspense } from "react";
import type { Metadata } from "next";

import { FsListSkeleton } from "@/components/fs/ui/list-skeleton";
import { FsWorkOrdersView } from "@/components/fs/work-orders/work-orders-view";

export const metadata: Metadata = {
  title: "Work Orders",
};

const SUBTITLE = "Manage, assign, and track all work orders";

export default function FsWorkOrdersPage() {
  return (
    // The view reads `?date=` from the URL, which needs a boundary to keep the
    // route statically rendered.
    <Suspense
      fallback={<FsListSkeleton title="Work Orders" subtitle={SUBTITLE} />}
    >
      <FsWorkOrdersView />
    </Suspense>
  );
}
