import { FileText, type LucideIcon } from "lucide-react";

/**
 * Documents this tenant may read.
 *
 * Scoped to the tenancy on purpose: their own lease papers, their own parking
 * and vehicle records, their own receipts and service reports, plus the
 * community rules everyone gets. Nothing management-only, nothing belonging to
 * the owner, and nothing from another household appears in this list — there is
 * no filter to widen it, because there is nothing else in it to reach.
 */

export const DOCUMENT_CATEGORIES = [
  "Tenancy",
  "Parking",
  "Payment",
  "Maintenance",
  "Community",
] as const;
export type DocumentCategory = (typeof DOCUMENT_CATEGORIES)[number];

/** Tab labels — plural where the category name reads oddly on a filter. */
export const CATEGORY_TAB_LABEL: Record<DocumentCategory, string> = {
  Tenancy: "Tenancy",
  Parking: "Parking",
  Payment: "Payments",
  Maintenance: "Maintenance",
  Community: "Community",
};

export const CATEGORY_ICON: Record<DocumentCategory, LucideIcon> = {
  Tenancy: FileText,
  Parking: FileText,
  Payment: FileText,
  Maintenance: FileText,
  Community: FileText,
};

export type TenDocument = {
  id: string;
  name: string;
  category: DocumentCategory;
  /** ISO day the document is dated. */
  date: string;
  /** Extension shown in the meta line. */
  fileType: "PDF";
  /** Size in bytes; formatted for display rather than stored pre-formatted. */
  bytes: number;
};

const KB = 1024;
const MB = KB * 1024;

/**
 * Newest first within each group, and grouped the way the tenant thinks about
 * them: the lease first, then the car, then the money, then the repairs.
 *
 * The dates line up with the records elsewhere in the portal — the tenancy
 * papers are dated at lease start, the receipts match the invoices they settle,
 * and the service reports match their maintenance requests.
 */
export const tenDocuments: TenDocument[] = [
  {
    id: "DOC-001",
    name: "Tenancy Agreement",
    category: "Tenancy",
    date: "2026-06-01",
    fileType: "PDF",
    bytes: Math.round(3.2 * MB),
  },
  {
    id: "DOC-002",
    name: "Move-In Inspection Report",
    category: "Tenancy",
    date: "2026-06-01",
    fileType: "PDF",
    bytes: Math.round(1.8 * MB),
  },
  {
    id: "DOC-003",
    name: "Security Deposit Receipt",
    category: "Tenancy",
    date: "2026-06-01",
    fileType: "PDF",
    bytes: 450 * KB,
  },
  {
    id: "DOC-004",
    name: "Parking Slot B1-42 Allocation",
    category: "Parking",
    date: "2026-06-01",
    fileType: "PDF",
    bytes: 780 * KB,
  },
  {
    id: "DOC-005",
    name: "Vehicle Registration - Toyota Camry",
    category: "Parking",
    date: "2026-06-05",
    fileType: "PDF",
    bytes: 420 * KB,
  },
  {
    id: "DOC-006",
    name: "August 2026 Bill Receipt",
    category: "Payment",
    date: "2026-08-01",
    fileType: "PDF",
    bytes: 310 * KB,
  },
  {
    id: "DOC-007",
    name: "July 2026 Bill Receipt",
    category: "Payment",
    date: "2026-07-28",
    fileType: "PDF",
    bytes: 300 * KB,
  },
  {
    id: "DOC-008",
    name: "AC Repair Service Report - July 2026",
    category: "Maintenance",
    date: "2026-07-22",
    fileType: "PDF",
    bytes: 890 * KB,
  },
  {
    id: "DOC-009",
    name: "Community Bylaws 2025 Edition",
    category: "Community",
    date: "2025-01-01",
    fileType: "PDF",
    bytes: Math.round(1.8 * MB),
  },
  {
    id: "DOC-010",
    name: "Window Handle Repair - July 2026",
    category: "Maintenance",
    date: "2026-07-10",
    fileType: "PDF",
    bytes: 560 * KB,
  },
];

/**
 * `450 KB`, `3.2 MB` — derived from the byte count rather than typed alongside
 * it, so a size and its file can never disagree.
 */
export function fileSize(bytes: number) {
  if (bytes >= MB) {
    const value = bytes / MB;
    // A whole number of megabytes reads better without the trailing `.0`.
    return `${value % 1 === 0 ? value : value.toFixed(1)} MB`;
  }
  return `${Math.round(bytes / KB)} KB`;
}

export function documentsInCategory(
  category: DocumentCategory | "All",
  documents: TenDocument[] = tenDocuments,
) {
  if (category === "All") return documents;
  return documents.filter((document) => document.category === category);
}
