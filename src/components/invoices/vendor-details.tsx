import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getVendorDetails } from "@/lib/vendor";
import { Mail, MapPin, Phone } from "lucide-react";

interface VendorDetailsProps {
  vendorName: string;
}

export function VendorDetails({ vendorName }: VendorDetailsProps) {
  const vendor = getVendorDetails(vendorName);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendor Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-semibold text-gray-900">{vendor.name}</p>
        </div>
        <div className="space-y-3 text-sm text-gray-600">
          <p className="flex items-start gap-2.5">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
            <span>{vendor.email}</span>
          </p>
          <p className="flex items-start gap-2.5">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
            <span>{vendor.phone}</span>
          </p>
          <p className="flex items-start gap-2.5">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
            <span>{vendor.address}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
