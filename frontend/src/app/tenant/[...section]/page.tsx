import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TenSectionPlaceholder } from "@/components/ten/ui/section-placeholder";
import { TEN_BASE, tenNavItemFor } from "@/lib/ten/nav";
import { tenantUnit } from "@/lib/ten/tenant";

/**
 * Catches the rail entries whose screens are not built yet.
 *
 * A real `page.tsx` at any of these paths wins over this catch-all, so each
 * section stops falling through here the moment its view lands. Anything not on
 * the rail is a genuine 404 and is treated as one — which is also what keeps
 * staff-only and owner-only paths from resolving inside this portal.
 */

type Props = { params: Promise<{ section: string[] }> };

function itemFor(section: string[]) {
  return tenNavItemFor(`${TEN_BASE}/${section.join("/")}`);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section } = await params;
  return { title: itemFor(section)?.label ?? "Tenant" };
}

export default async function TenantSectionPage({ params }: Props) {
  const { section } = await params;
  const item = itemFor(section);

  if (!item) notFound();

  return (
    <TenSectionPlaceholder
      title={item.label}
      subtitle={`Unit ${tenantUnit.number} at ${tenantUnit.property}`}
    />
  );
}
