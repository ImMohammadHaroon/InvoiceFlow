export function getVendorDetails(vendorName: string) {
  const slug = vendorName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.|\.$/g, "");

  return {
    name: vendorName,
    email: `ap@${slug.split(".").slice(0, 2).join("") || "vendor"}.com`,
    phone: "(555) 014-2200",
    address: "1840 Industrial Way, Seattle, WA 98134",
  };
}
