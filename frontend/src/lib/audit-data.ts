/**
 * Audit log types, module catalog and seed entries.
 *
 * The seed reproduces the design. Live entries are appended at runtime by
 * `audit-store.ts` whenever something is created, updated, deleted, or a login
 * is attempted. The last three modules (Users, Roles, Permissions) are not in
 * the design's chip row — they were added so this app's own admin actions have
 * somewhere to land.
 */

export const AUDIT_MODULES = [
  "Work Orders",
  "Billing",
  "Residents",
  "Maintenance",
  "Vendors",
  "Inspections",
  "Assets",
  "Facilities",
  "Complaints",
  "Reports",
  "Units",
  "Security",
  "Announcements",
  "Users",
  "Roles",
  "Permissions",
  "Settings",
] as const;

export type AuditModule = (typeof AUDIT_MODULES)[number];

/** Amber for money/assets, red for security, green everywhere else. */
export const MODULE_TONE: Record<AuditModule, string> = {
  "Work Orders": "bg-green-50 text-green-700",
  Billing: "bg-amber-50 text-amber-700",
  Residents: "bg-green-50 text-green-700",
  Maintenance: "bg-green-50 text-green-700",
  Vendors: "bg-green-50 text-green-700",
  Inspections: "bg-green-50 text-green-700",
  Assets: "bg-amber-50 text-amber-700",
  Facilities: "bg-green-50 text-green-700",
  Complaints: "bg-green-50 text-green-700",
  Reports: "bg-green-50 text-green-700",
  Units: "bg-green-50 text-green-700",
  Security: "bg-rose-50 text-rose-700",
  Announcements: "bg-green-50 text-green-700",
  Users: "bg-green-50 text-green-700",
  Roles: "bg-green-50 text-green-700",
  Permissions: "bg-green-50 text-green-700",
  Settings: "bg-green-50 text-green-700",
};

export type AuditEntry = {
  id: string;
  /** "YYYY-MM-DD HH:mm" */
  timestamp: string;
  action: string;
  company: string;
  module: AuditModule;
  performedBy: string;
  details: string;
};

export function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export const auditSeed: AuditEntry[] = [
  {
    id: "a20",
    timestamp: "2026-08-07 09:14",
    action: "Work Order Created",
    company: "Sunrise Residence",
    module: "Work Orders",
    performedBy: "Sarah Chen",
    details:
      "New work order WO-2026-045 created for HVAC repair in Tower B, Unit 305",
  },
  {
    id: "a19",
    timestamp: "2026-08-07 08:52",
    action: "Invoice Generated",
    company: "Pacific Living Solutions",
    module: "Billing",
    performedBy: "Sarah Chen",
    details:
      "Monthly invoice INV-2026-012 generated for Smith residence — $2,450.00",
  },
  {
    id: "a18",
    timestamp: "2026-08-07 08:30",
    action: "Resident Added",
    company: "System",
    module: "Residents",
    performedBy: "John Doe",
    details:
      "New tenant Patricia Brown registered for Tower A, Unit 1201 with 12-month lease",
  },
  {
    id: "a17",
    timestamp: "2026-08-06 17:42",
    action: "Maintenance Updated",
    company: "Sunrise Residence",
    module: "Maintenance",
    performedBy: "James Wilson",
    details:
      "Status changed to In Progress for leak repair request MR-2026-038 in Tower C",
  },
  {
    id: "a16",
    timestamp: "2026-08-06 15:30",
    action: "Invoice Resent",
    company: "Green Heights Towers",
    module: "Billing",
    performedBy: "Sarah Chen",
    details:
      "Invoice resent to billing@greenheights.com for outstanding payment on Unit 508",
  },
  {
    id: "a15",
    timestamp: "2026-08-06 14:16",
    action: "Payment Received",
    company: "Skyline Property Group",
    module: "Billing",
    performedBy: "Greg Holt",
    details:
      "Payment of $3,200.00 received via bank transfer for invoice INV-2026-009",
  },
  {
    id: "a14",
    timestamp: "2026-08-06 12:48",
    action: "Vendor Contract Added",
    company: "System",
    module: "Vendors",
    performedBy: "Sarah Chen",
    details:
      "Elevator maintenance contract signed with Metro Elevator Services for Tower A & B",
  },
  {
    id: "a13",
    timestamp: "2026-08-06 11:00",
    action: "Inspection Scheduled",
    company: "Lotus Towers Inc",
    module: "Inspections",
    performedBy: "Sarah Chen",
    details:
      "Fire safety inspection scheduled for August 12th, all common areas and exits",
  },
  {
    id: "a12",
    timestamp: "2026-08-05 11:05",
    action: "Asset Updated",
    company: "System",
    module: "Assets",
    performedBy: "Sarah Chen",
    details:
      "Generator maintenance log updated — service completed, next due October 2026",
  },
  {
    id: "a11",
    timestamp: "2026-08-05 10:22",
    action: "Booking Approved",
    company: "Sunrise Residence",
    module: "Facilities",
    performedBy: "Carlos Rivera",
    details:
      "Banquet hall booking approved for Unit 802 resident on August 15th, 2:00 PM — 6:00 PM",
  },
  {
    id: "a10",
    timestamp: "2026-08-05 09:45",
    action: "Complaint Resolved",
    company: "Green Heights Towers",
    module: "Complaints",
    performedBy: "Sarah Chen",
    details:
      "Noise complaint from Unit 410 resolved — warning issued, resident acknowledged",
  },
  {
    id: "a9",
    timestamp: "2026-08-04 16:30",
    action: "Report Exported",
    company: "Pacific Living Solutions",
    module: "Reports",
    performedBy: "Alex Morgan",
    details:
      "Monthly occupancy report exported for July 2026 — 94.2% average across all towers",
  },
  {
    id: "a8",
    timestamp: "2026-08-04 14:10",
    action: "Unit Status Changed",
    company: "Skyline Property Group",
    module: "Units",
    performedBy: "James Wilson",
    details:
      "Unit 1503 Tower D marked as occupied — lease signed, tenant moved in successfully",
  },
  {
    id: "a7",
    timestamp: "2026-08-04 11:55",
    action: "Security Alert",
    company: "Lotus Towers Inc",
    module: "Security",
    performedBy: "System",
    details:
      "Unauthorized access attempt detected at Gate B — visitor failed ID verification twice",
  },
  {
    id: "a6",
    timestamp: "2026-08-04 09:30",
    action: "Preventive Plan Created",
    company: "Sunrise Residence",
    module: "Maintenance",
    performedBy: "Carlos Rivera",
    details:
      "Quarterly HVAC servicing plan created for all towers — next run September 15th",
  },
  {
    id: "a5",
    timestamp: "2026-08-03 15:20",
    action: "Announcement Posted",
    company: "Green Heights Towers",
    module: "Announcements",
    performedBy: "Sarah Chen",
    details:
      "Community notice posted: Swimming pool closure for maintenance on August 10th — 11th",
  },
  {
    id: "a4",
    timestamp: "2026-08-03 13:45",
    action: "Vendor Added",
    company: "System",
    module: "Vendors",
    performedBy: "John Doe",
    details:
      'New cleaning vendor "Sparkle Clean Services" onboarded for common area maintenance',
  },
  {
    id: "a3",
    timestamp: "2026-08-03 10:00",
    action: "Inspection Completed",
    company: "Pacific Living Solutions",
    module: "Inspections",
    performedBy: "Alex Morgan",
    details:
      "Common area safety inspection completed — 2 minor issues flagged, action items created",
  },
  {
    id: "a2",
    timestamp: "2026-08-02 16:00",
    action: "Lease Renewal",
    company: "Skyline Property Group",
    module: "Residents",
    performedBy: "Greg Holt",
    details:
      "Lease renewed for Unit 1102 resident — 12-month extension at revised rate $2,800/month",
  },
  {
    id: "a1",
    timestamp: "2026-08-02 11:30",
    action: "Work Order Closed",
    company: "Lotus Towers Inc",
    module: "Work Orders",
    performedBy: "James Wilson",
    details:
      "Plumbing repair WO-2026-041 closed — leak fixed, pressure tested, resident confirmed",
  },
];
