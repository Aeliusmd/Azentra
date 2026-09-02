import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SoSectionPlaceholder } from "@/components/so/ui/section-placeholder";
import { SO_BASE, soNavItemFor } from "@/lib/so/nav";
import { securityOfficer } from "@/lib/so/officer";
import { soPropertyName } from "@/lib/so/properties-data";

/**
 * Catches the rail entries whose screens are not built yet.
 *
 * A real `page.tsx` at any of these paths wins over this catch-all, so each
 * section stops falling through here the moment its view lands. Anything not on
 * the rail is a genuine 404 and is treated as one — which is what keeps
 * billing, work orders, vendors and the admin console from resolving inside
 * this portal at all.
 */

type Props = { params: Promise<{ section: string[] }> };

function itemFor(section: string[]) {
  return soNavItemFor(`${SO_BASE}/${section.join("/")}`);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section } = await params;
  return { title: itemFor(section)?.label ?? "Security Officer" };
}

export default async function SecurityOfficerSectionPage({ params }: Props) {
  const { section } = await params;
  const item = itemFor(section);

  if (!item) notFound();

  return (
    <SoSectionPlaceholder
      title={item.label}
      subtitle={`${soPropertyName(securityOfficer.propertyId)} · ${securityOfficer.gate}`}
    />
  );
}
