import {
  CreditCard,
  House,
  SquareParking,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/**
 * Paperwork this household may read.
 *
 * Only two kinds reach a resident: what the property publishes to everybody
 * (bylaws, policies) and what belongs to their own unit (their deed, their
 * lease, their receipts). Another household's documents have no route here.
 */

export const DOCUMENT_CATEGORIES = [
  "Ownership",
  "Parking",
  "Payment Receipts",
  "Maintenance",
  "Community",
] as const;
export type DocumentCategory = (typeof DOCUMENT_CATEGORIES)[number];

/** Tabs across the top — "All Documents" first, then one per category. */
export const DOCUMENT_TABS = ["All Documents", ...DOCUMENT_CATEGORIES] as const;

export const CATEGORY_ICON: Record<DocumentCategory, LucideIcon> = {
  Ownership: House,
  Parking: SquareParking,
  "Payment Receipts": CreditCard,
  Maintenance: Wrench,
  Community: Users,
};

export type ResidentDocument = {
  id: string;
  name: string;
  category: DocumentCategory;
  /** ISO day the document is dated. */
  date: string;
  /** Size on disk, formatted for display rather than stored as a string. */
  bytes: number;
  /** File format, as the row states it. */
  type: "PDF";
};

const KB = 1024;
const MB = 1024 * KB;

/**
 * Seed order is display order: the unit's own papers first, then the running
 * records, then what the property publishes. Not sorted by date — a resident
 * looking for their deed is not looking for the newest thing.
 */
export const residentDocuments: ResidentDocument[] = [
  {
    id: "DOC-1",
    name: "Ownership Title Deed",
    category: "Ownership",
    date: "2024-03-15",
    bytes: Math.round(2.4 * MB),
    type: "PDF",
  },
  {
    id: "DOC-2",
    name: "Apartment Purchase Agreement",
    category: "Ownership",
    date: "2024-03-10",
    bytes: Math.round(4.1 * MB),
    type: "PDF",
  },
  {
    id: "DOC-3",
    name: "Parking Slot B1-42 Allocation",
    category: "Parking",
    date: "2024-03-15",
    bytes: 780 * KB,
    type: "PDF",
  },
  {
    id: "DOC-4",
    name: "Vehicle Registration - Toyota Camry",
    category: "Parking",
    date: "2024-03-20",
    bytes: 450 * KB,
    type: "PDF",
  },
  {
    id: "DOC-5",
    name: "August 2026 Bill Receipt",
    category: "Payment Receipts",
    date: "2026-08-01",
    bytes: 320 * KB,
    type: "PDF",
  },
  {
    id: "DOC-6",
    name: "July 2026 Bill Receipt",
    category: "Payment Receipts",
    date: "2026-07-28",
    bytes: 310 * KB,
    type: "PDF",
  },
  {
    id: "DOC-7",
    name: "AC Repair Service Report - July 2026",
    category: "Maintenance",
    date: "2026-07-22",
    bytes: 890 * KB,
    type: "PDF",
  },
  {
    id: "DOC-8",
    name: "Community Bylaws 2025 Edition",
    category: "Community",
    date: "2025-01-01",
    bytes: Math.round(1.8 * MB),
    type: "PDF",
  },
  {
    id: "DOC-9",
    name: "Tenant Lease Agreement - David Kim",
    category: "Ownership",
    date: "2025-06-01",
    bytes: Math.round(1.2 * MB),
    type: "PDF",
  },
];

/**
 * `798720` → `780 KB`; `2516582` → `2.4 MB`.
 *
 * Kept as a byte count rather than the printed string so the two never disagree
 * and a sort by size would be possible.
 */
export function fileSize(bytes: number) {
  const kb = bytes / KB;
  return kb < KB ? `${Math.round(kb)} KB` : `${(kb / KB).toFixed(1)} MB`;
}
