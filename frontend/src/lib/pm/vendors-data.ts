/** Mock vendors. Swap for a `src/lib/api.ts` call when the backend lands. */

export const VENDOR_STATUSES = ["Active", "Expired"] as const;
export type VendorStatus = (typeof VENDOR_STATUSES)[number];

export const VENDOR_CATEGORIES = [
  "General",
  "Elevator Maintenance",
  "Pool Maintenance",
  "Fire Safety",
  "Water Treatment",
  "Generator Maintenance",
  "Landscaping",
  "Security Systems",
  "HVAC Services",
] as const;

export const PAYMENT_TERMS = [
  "Net 30",
  "Net 15",
  "Net 60",
  "On Completion",
] as const;

export type Vendor = {
  id: string;
  name: string;
  category: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  services: string[];
  contractStart: string;
  contractEnd: string;
  paymentTerms: string;
  totalSpent: number;
  rating: number;
  status: VendorStatus;
};

export const vendors: Vendor[] = [
  {
    id: "v1",
    name: "ElevatorPro Services",
    category: "Elevator Maintenance",
    contact: "Richard Blake",
    phone: "+1 555 3001",
    email: "richard@elevatorpro.com",
    address: "452 Industrial Blvd, Houston TX",
    services: ["Elevator Installation", "Maintenance", "Safety Inspection"],
    contractStart: "2022-06-15",
    contractEnd: "2027-06-15",
    paymentTerms: "Net 30",
    totalSpent: 48500,
    rating: 4.8,
    status: "Active",
  },
  {
    id: "v2",
    name: "AquaClean Services",
    category: "Pool Maintenance",
    contact: "Maria Santos",
    phone: "+1 555 3002",
    email: "maria@aquaclean.com",
    address: "88 Lakeside Road, Houston TX",
    services: ["Pool Cleaning", "Water Testing", "Pump Servicing"],
    contractStart: "2023-01-10",
    contractEnd: "2026-01-10",
    paymentTerms: "Net 30",
    totalSpent: 18200,
    rating: 4.5,
    status: "Active",
  },
  {
    id: "v3",
    name: "FireSafe Inc",
    category: "Fire Safety",
    contact: "James O'Brien",
    phone: "+1 555 3003",
    email: "james@firesafe.com",
    address: "17 Beacon Street, Houston TX",
    services: [
      "Extinguisher Service",
      "Alarm Testing",
      "Sprinkler Maintenance",
    ],
    contractStart: "2022-06-15",
    contractEnd: "2027-06-15",
    paymentTerms: "Net 15",
    totalSpent: 22000,
    rating: 4.9,
    status: "Active",
  },
  {
    id: "v4",
    name: "HydroTech Services",
    category: "Water Treatment",
    contact: "Amit Patel",
    phone: "+1 555 3004",
    email: "amit@hydrotech.com",
    address: "310 Waterworks Ave, Houston TX",
    services: ["Water Treatment", "Tank Cleaning", "Quality Testing"],
    contractStart: "2022-09-01",
    contractEnd: "2027-09-01",
    paymentTerms: "Net 30",
    totalSpent: 15600,
    rating: 4.6,
    status: "Active",
  },
  {
    id: "v5",
    name: "PowerGen Systems",
    category: "Generator Maintenance",
    contact: "Steve Morrison",
    phone: "+1 555 3005",
    email: "steve@powergen.com",
    address: "25 Dynamo Park, Houston TX",
    services: ["Generator Servicing", "Load Testing", "Fuel Management"],
    contractStart: "2022-06-15",
    contractEnd: "2027-06-15",
    paymentTerms: "Net 30",
    totalSpent: 31500,
    rating: 4.7,
    status: "Active",
  },
  {
    id: "v6",
    name: "GreenScape Landscaping",
    category: "Landscaping",
    contact: "Linda Park",
    phone: "+1 555 3006",
    email: "linda@greenscape.com",
    address: "9 Garden Lane, Houston TX",
    services: ["Lawn Care", "Tree Trimming", "Irrigation"],
    contractStart: "2023-04-01",
    contractEnd: "2026-04-01",
    paymentTerms: "Net 15",
    totalSpent: 24000,
    rating: 4.3,
    status: "Active",
  },
  {
    id: "v7",
    name: "SecureView Tech",
    category: "Security Systems",
    contact: "Alan Wright",
    phone: "+1 555 3007",
    email: "alan@secureview.com",
    address: "140 Sentinel Road, Houston TX",
    services: ["CCTV Installation", "Access Control", "Alarm Monitoring"],
    contractStart: "2022-06-15",
    contractEnd: "2025-06-15",
    paymentTerms: "Net 60",
    totalSpent: 28000,
    rating: 4.4,
    status: "Expired",
  },
  {
    id: "v8",
    name: "CoolAir Solutions",
    category: "HVAC Services",
    contact: "Diana Ross",
    phone: "+1 555 3008",
    email: "diana@coolair.com",
    address: "63 Breeze Avenue, Houston TX",
    services: ["AC Servicing", "Duct Cleaning", "Chiller Maintenance"],
    contractStart: "2023-02-01",
    contractEnd: "2026-02-01",
    paymentTerms: "Net 30",
    totalSpent: 19200,
    rating: 4.2,
    status: "Active",
  },
];

export const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
