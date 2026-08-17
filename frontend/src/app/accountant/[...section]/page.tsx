import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AccSectionPlaceholder } from "@/components/acc/ui/section-placeholder";
import { ACC_BASE, accNavItemFor } from "@/lib/acc/nav";

/**
 * Catches the rail entries whose screens are not built yet.
 *
 * A real `page.tsx` at any of these paths wins over this catch-all, so each
 * section stops falling through here the moment its view lands. Anything not on
 * the rail is a genuine 404 and is treated as one.
 */

type Props = { params: Promise<{ section: string[] }> };

function itemFor(section: string[]) {
  return accNavItemFor(`${ACC_BASE}/${section.join("/")}`);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section } = await params;
  return { title: itemFor(section)?.label ?? "Accountant" };
}

export default async function AccountantSectionPage({ params }: Props) {
  const { section } = await params;
  const item = itemFor(section);

  if (!item) notFound();

  return (
    <AccSectionPlaceholder
      title={item.label}
      subtitle="Financial operations for the selected property"
    />
  );
}
