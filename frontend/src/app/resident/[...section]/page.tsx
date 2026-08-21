import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ResSectionPlaceholder } from "@/components/res/ui/section-placeholder";
import { RES_BASE, resNavItemFor } from "@/lib/res/nav";

/**
 * Catches the rail entries whose screens are not built yet.
 *
 * A real `page.tsx` at any of these paths wins over this catch-all, so each
 * section stops falling through here the moment its view lands. Anything not on
 * the rail is a genuine 404 and is treated as one — which is also what keeps
 * staff-only paths from resolving inside this portal.
 */

type Props = { params: Promise<{ section: string[] }> };

function itemFor(section: string[]) {
  return resNavItemFor(`${RES_BASE}/${section.join("/")}`);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section } = await params;
  return { title: itemFor(section)?.label ?? "Resident" };
}

export default async function ResidentSectionPage({ params }: Props) {
  const { section } = await params;
  const item = itemFor(section);

  if (!item) notFound();

  return (
    <ResSectionPlaceholder
      title={item.label}
      subtitle="Your unit at Sunrise Residence"
    />
  );
}
