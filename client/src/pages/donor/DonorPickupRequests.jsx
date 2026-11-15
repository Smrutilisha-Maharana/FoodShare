import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
Package,
Clock,
CheckCircle,
XCircle,
RefreshCw,
MapPin,
Calendar,
Building2,
AlertCircle,
} from "lucide-react";

import api from "../../services/api";

const DonorPickupRequests = () => {
const [requests, setRequests] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [updatingId, setUpdatingId] = useState(null);

const fetchRequests = async () => {
try {
setLoading(true);
setError("");


  const response = await api.get("/requests/donor");

  setRequests(response.data.requests || response.data || []);
} catch (err) {
  setError(
    err.response?.data?.message || "Failed to load pickup requests."
  );
} finally {
  setLoading(false);
}


};

useEffect(() => {
fetchRequests();
}, []);

const updateStatus = async (requestId, status) => {
try {
setUpdatingId(requestId);


  await api.patch(`/requests/${requestId}/status`, { status });

  setRequests((previous) =>
    previous.map((request) =>
      request._id === requestId
        ? { ...request, status }
        : request
    )
  );
} catch (err) {
  alert(
    err.response?.data?.message || "Unable to update request status."
  );
} finally {
  setUpdatingId(null);
}


};

const statusStyle = (status) => {
switch (status) {
case "approved":
return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
case "rejected":
return "bg-red-500/10 text-red-400 border-red-500/20";
case "collected":
return "bg-blue-500/10 text-blue-400 border-blue-500/20";
default:
return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
}
};

if (loading) {
return ( <div className="min-h-screen bg-[#070b0a] flex items-center justify-center"> <RefreshCw
       className="animate-spin text-emerald-400"
       size={32}
     /> </div>
);
}

return ( <div className="min-h-screen bg-[#070b0a] text-white p-5 md:p-8"> <div className="max-w-6xl mx-auto">


    {/* Header */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">
          Pickup Requests
        </h1>
        <p className="text-gray-400 mt-2">
          Manage NGO requests for your food donations.
        </p>
      </div>

      <button
        onClick={fetchRequests}
        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#101815] border border-white/10 hover:border-emerald-500/40 transition"
      >
        <RefreshCw size={17} />
        Refresh
      </button>
    </div>

    {/* Summary */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {[
        {
          title: "Total Requests",
          value: requests.length,
          icon: Package,
        },
        {
          title: "Pending",
          value: requests.filter((r) => r.status === "pending").length,
          icon: Clock,
        },
        {
          title: "Approved",
          value: requests.filter((r) => r.status === "approved").length,
          icon: CheckCircle,
        },
      ].map((item, index) => {
        const Icon = item.icon;

        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#101815] border border-white/10 rounded-2xl p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">
                  {item.title}
                </p>
                <h2 className="text-3xl font-bold mt-2">
                  {item.value}
                </h2>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Icon size={23} />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>

    {/* Error */}
    {error && (
      <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex gap-2">
        <AlertCircle size={20} />
        {error}
      </div>
    )}

    {/* Request List */}
    {requests.length === 0 ? (
      <div className="bg-[#101815] border border-white/10 rounded-2xl p-12 text-center">
        <Package
          size={45}
          className="mx-auto text-gray-500 mb-4"
        />
        <h2 className="text-xl font-semibold">
          No Pickup Requests
        </h2>
        <p className="text-gray-400 mt-2">
          You haven't received any NGO pickup requests yet.
        </p>
      </div>
    ) : (
      <div className="space-y-5">
        {requests.map((request) => {
          const donation = request.donation || {};
          const ngo = request.ngo || {};

          return (
            <motion.div
              key={request._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#101815] border border-white/10 rounded-2xl p-5 md:p-6"
            >
              {/* Donation Details */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                    <Package size={27} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold">
                      {donation.foodName ||
                        donation.title ||
                        "Food Donation"}
                    </h2>

                    <p className="text-gray-400 text-sm mt-1">
                      Quantity: {donation.quantity || "Not specified"}
                    </p>

                    <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-400">
                      {donation.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={15} />
                          {donation.location}
                        </span>
                      )}

                      {request.createdAt && (
                        <span className="flex items-center gap-1">
                          <Calendar size={15} />
                          {new Date(
                            request.createdAt
                          ).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status */}
                <span
                  className={`px-3 py-1.5 rounded-full border text-xs font-semibold capitalize w-fit ${statusStyle(
                    request.status
                  )}`}
                >
                  {request.status}
                </span>
              </div>

              {/* NGO Details */}
              <div className="mt-5 p-4 rounded-xl bg-[#0b110e] border border-white/5">
                <div className="flex items-center gap-2 text-emerald-400 mb-2">
                  <Building2 size={18} />
                  <h3 className="font-semibold">
                    NGO Information
                  </h3>
                </div>

                <p className="text-white font-medium">
                  {ngo.organizationName ||
                    ngo.name ||
                    ngo.email ||
                    "NGO"}
                </p>

                {ngo.email && (
                  <p className="text-gray-400 text-sm mt-1">
                    {ngo.email}
                  </p>
                )}

                {request.message && (
                  <p className="text-gray-400 text-sm mt-3">
                    <span className="text-gray-300 font-medium">
                      Message:{" "}
                    </span>
                    {request.message}
                  </p>
                )}
              </div>

              {/* Actions */}
              {request.status === "pending" && (
                <div className="flex flex-col sm:flex-row gap-3 mt-5">
                  <button
                    disabled={updatingId === request._id}
                    onClick={() =>
                      updateStatus(request._id, "approved")
                    }
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-semibold hover:bg-emerald-400 disabled:opacity-50 transition"
                  >
                    <CheckCircle size={17} />
                    Approve Request
                  </button>

                  <button
                    disabled={updatingId === request._id}
                    onClick={() =>
                      updateStatus(request._id, "rejected")
                    }
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 disabled:opacity-50 transition"
                  >
                    <XCircle size={17} />
                    Reject Request
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    )}
  </div>
</div>


);
};

export default DonorPickupRequests;
