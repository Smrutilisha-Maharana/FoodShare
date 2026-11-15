import { MapPin, Clock, Package } from "lucide-react";

export default function DonationCard({ donation }) {
  const expiry = new Date(donation.expiryTime);
  const isExpired = expiry <= new Date();

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="bg-emerald-50 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              {donation.foodName}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Donated by {donation.donor?.name || "Food donor"}
            </p>
          </div>

          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold capitalize text-emerald-700">
            {donation.status}
          </span>
        </div>
      </div>

      <div className="space-y-3 p-5">
        <p className="text-sm leading-6 text-gray-600">
          {donation.description}
        </p>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Package size={17} />
          <span>
            {donation.quantity} {donation.unit}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin size={17} />
          <span>{donation.pickupAddress}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock size={17} />
          <span>
            Expires: {expiry.toLocaleString()}
          </span>
        </div>

        <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs capitalize text-gray-700">
          {donation.foodType.replace("-", " ")}
        </span>

        {isExpired && (
          <p className="text-sm font-semibold text-red-600">
            This food has passed its expiry deadline.
          </p>
        )}
      </div>
    </div>
  );
}