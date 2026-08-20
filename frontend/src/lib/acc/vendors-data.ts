/**
 * The suppliers the property buys from, and where each account stands.
 *
 * Not scoped to a property: a vendor is contracted across the portfolio, so
 * these balances are the whole relationship rather than one set of books.
 * Outstanding is derived — an account that showed a balance disagreeing with
 * its own two figures would be worthless.
 */

export const VENDOR_STATUSES = ["Active", "Inactive"] as const;
export type VendorStatus = (typeof VENDOR_STATUSES)[number];

export type VendorAccount = {
  id: string;
  name: string;
  /** The trade the vendor is engaged for. */
  category: string;
  contact: string;
  phone: string;
  email: string;
  invoiced: number;
  paid: number;
  /** `invoiced - paid`. */
  outstanding: number;
  status: VendorStatus;
};

/** `name, category, contact, email, invoiced, paid, status`. */
type Row = [string, string, string, string, number, number, VendorStatus];

const VENDORS: Row[] = [
  ["ABC Plumbing", "Plumbing", "Raj Fernando", "raj@abcplumbing.com", 1_250_000, 980_000, "Active"],
  ["CleanPro Services", "Cleaning", "Marie Cole", "marie@cleanpro.com", 2_000_000, 1_750_000, "Active"],
  ["ElevatorPro Ltd", "Maintenance", "Sunil Perera", "sunil@elevatorpro.com", 720_000, 540_000, "Active"],
  ["AquaClean Pool Services", "Maintenance", "Tom Baker", "tom@aquaclean.com", 680_000, 595_000, "Active"],
  ["GreenScape Ltd", "Landscaping", "Anika Silva", "anika@greenscape.com", 960_000, 840_000, "Active"],
  ["SecureTech Solutions", "Security", "Dilan Cooray", "dilan@securetech.com", 760_000, 665_000, "Active"],
  ["National Power Co", "Utilities", "Nuwan Jayasinghe", "nuwan@nationalpower.lk", 4_800_000, 4_200_000, "Active"],
  ["City Water Board", "Utilities", "Shalini Perera", "shalini@citywater.lk", 1_800_000, 1_500_000, "Active"],
];

export function vendorAccounts(): VendorAccount[] {
  return VENDORS.map(
    ([name, category, contact, email, invoiced, paid, status], index) => ({
      id: `VEN-${1001 + index}`,
      name,
      category,
      contact,
      // The account number doubles as the supplier's direct line.
      phone: `+1 555 ${1001 + index}`,
      email,
      invoiced,
      paid,
      outstanding: invoiced - paid,
      status,
    }),
  );
}
