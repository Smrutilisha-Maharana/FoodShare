import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  Sparkles,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import api from "../../services/api";

const initialForm = {
  title: "",
  description: "",
  foodType: "Prepared Food",
  quantity: "",
  unit: "serving",
  expiryDate: "",
  pickupAddress: "",
  contactPhone: "",
};

const foodTypes = [
  "Prepared Food",
  "Fruits & Vegetables",
  "Bakery Items",
  "Packaged Food",
  "Dairy Products",
  "Other",
];

export default function AddDonation() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const validatePhoneNumber = (phone) => {
    const cleanedPhone = phone.replace(/[\s-]/g, "");
    return /^(?:\+91|91)?[6-9]\d{9}$/.test(cleanedPhone);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.expiryDate) {
      toast.error("Please select an expiry date.");
      return;
    }

    if (new Date(form.expiryDate) <= new Date()) {
      toast.error("Please select a future expiry date.");
      return;
    }

    if (Number(form.quantity) <= 0) {
      toast.error("Quantity must be greater than zero.");
      return;
    }

    if (!validatePhoneNumber(form.contactPhone)) {
      toast.error("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    setLoading(true);

    try {
      const donationData = {
        foodName: form.title.trim(),
        title: form.title.trim(),
        description: form.description.trim(),
        quantity: Number(form.quantity),
        unit: form.unit,
        foodType: form.foodType,
        expiryTime: new Date(form.expiryDate).toISOString(),
        pickupAddress: form.pickupAddress.trim(),
        contactPhone: form.contactPhone.trim(),
      };

      console.log("Donation data being submitted:", donationData);

      const response = await api.post("/donations", donationData);

      console.log("Donation response:", response.data);

      setSubmitted(true);
      toast.success("Donation published successfully!");

      setTimeout(() => {
        navigate("/donor/manage-donations");
      }, 1200);
    } catch (error) {
      console.error("Donation error:", error.response?.data || error);

      toast.error(
        error.response?.data?.message ||
          "Unable to publish donation. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-2xl border border-white/10 bg-[#080e0b] px-4 py-3.5 text-sm text-white outline-none transition duration-300 placeholder:text-gray-500 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10";

  const labelClass =
    "mb-2 block text-sm font-semibold text-gray-300";

  return (
    <div className="min-h-screen overflow-hidden bg-[#070b0a] px-4 py-8 text-white md:px-8">
      {/* Animated Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          animate={{ y: [0, -25, 0], x: [0, 15, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -right-20 top-20 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl"
        />

        <motion.div
          animate={{ y: [0, 25, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -left-20 bottom-10 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl"
        />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Back Button */}
        <Link
          to="/donor/dashboard"
          className="mb-7 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-gray-400 transition hover:bg-[#101815] hover:text-emerald-400"
        >
          <ArrowLeft size={18} />
          Back to dashboard
        </Link>

        <div className="grid items-start gap-8 lg:grid-cols-[1.5fr_0.8fr]">
          {/* Donation Form */}
          <motion.section
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-[2rem] border border-white/10 bg-[#101815]/95 p-5 shadow-xl shadow-black/30 backdrop-blur-xl sm:p-8"
          >
            {/* Heading */}
            <div className="mb-8 flex items-start gap-4">
              <div className="rounded-2xl bg-emerald-500/10 p-4 text-emerald-400">
                <UtensilsCrossed size={28} />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
                  Make a difference
                </span>

                <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
                  Add a Donation
                </h1>

                <p className="mt-2 text-sm leading-6 text-gray-400">
                  Share your surplus food and help someone in your community.
                </p>
              </div>
            </div>

            {/* Success Message */}
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 px-6 py-12 text-center"
              >
                <CheckCircle2
                  size={58}
                  className="mx-auto text-emerald-400"
                />

                <h2 className="mt-5 text-2xl font-bold text-white">
                  Donation submitted!
                </h2>

                <p className="mt-2 text-gray-400">
                  Thank you for helping reduce food waste.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Food Name */}
                <div>
                  <label className={labelClass}>
                    Food name *
                  </label>

                  <input
                    name="title"
                    value={form.title}
                    onChange={updateField}
                    className={inputClass}
                    placeholder="e.g. Fresh vegetable meals"
                    required
                    maxLength={100}
                  />
                </div>

                {/* Food Category */}
                <div>
                  <label className={labelClass}>
                    Food category *
                  </label>

                  <select
                    name="foodType"
                    value={form.foodType}
                    onChange={updateField}
                    className={inputClass}
                    required
                  >
                    {foodTypes.map((type) => (
                      <option
                        key={type}
                        value={type}
                        className="bg-[#080e0b] text-white"
                      >
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className={labelClass}>
                    Description *
                  </label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={updateField}
                    className={`${inputClass} min-h-28 resize-y`}
                    placeholder="Describe the food, preparation time, and storage conditions..."
                    required
                    maxLength={1000}
                  />
                </div>

                {/* Quantity and Unit */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>
                      Quantity *
                    </label>

                    <input
                      name="quantity"
                      type="number"
                      min="1"
                      value={form.quantity}
                      onChange={updateField}
                      className={inputClass}
                      placeholder="e.g. 25"
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Unit *
                    </label>

                    <select
                      name="unit"
                      value={form.unit}
                      onChange={updateField}
                      className={inputClass}
                      required
                    >
                      <option value="serving">Serving</option>
                      <option value="kg">Kg</option>
                      <option value="packets">Packets</option>
                      <option value="boxs">Boxes</option>
                      <option value="items">Items</option>
                      <option value="litres">Litres</option>
                    </select>
                  </div>
                </div>

                {/* Expiry Date */}
                <div>
                  <label className={labelClass}>
                    Expiry date and time *
                  </label>

                  <input
                    name="expiryDate"
                    type="datetime-local"
                    value={form.expiryDate}
                    onChange={updateField}
                    min={new Date(
                      Date.now() - new Date().getTimezoneOffset() * 60000
                    )
                      .toISOString()
                      .slice(0, 16)}
                    className={inputClass}
                    required
                  />

                  <p className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                    <Clock size={14} />
                    Choose a realistic deadline for safe collection.
                  </p>
                </div>

                {/* Pickup Address */}
                <div>
                  <label className={labelClass}>
                    Pickup address *
                  </label>

                  <textarea
                    name="pickupAddress"
                    value={form.pickupAddress}
                    onChange={updateField}
                    className={`${inputClass} min-h-24`}
                    placeholder="Enter the complete pickup location"
                    required
                    maxLength={500}
                  />
                </div>

                {/* Contact Phone */}
                <div>
                  <label className={labelClass}>
                    Contact phone *
                  </label>

                  <input
                    name="contactPhone"
                    type="tel"
                    value={form.contactPhone}
                    onChange={updateField}
                    className={inputClass}
                    placeholder="Phone number for pickup coordination"
                    required
                    maxLength={13}
                  />
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Submitting..." : "Publish Donation"}

                    {!loading && <ArrowRight size={18} />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setForm(initialForm)}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#080e0b] px-5 py-4 font-semibold text-gray-300 transition hover:bg-white/5"
                  >
                    <X size={17} />
                    Clear
                  </button>
                </div>
              </form>
            )}
          </motion.section>

          {/* Right Side */}
          <motion.aside
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="space-y-5 lg:sticky lg:top-8"
          >
            {/* Green Information Card */}
            <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-7 text-white shadow-xl shadow-emerald-900/15">
              <motion.div
                animate={{ rotate: [0, 8, -8, 0], y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="mb-6 inline-flex rounded-2xl bg-white/15 p-4"
              >
                <Package size={32} />
              </motion.div>

              <Sparkles size={20} className="mb-3 text-emerald-200" />

              <h2 className="text-2xl font-black">
                Every meal matters.
              </h2>

              <p className="mt-3 text-sm leading-6 text-emerald-50">
                Your surplus food can become a valuable meal for someone who
                needs it. Share responsibly and help build a community with
                less food waste.
              </p>

              {/* Live Preview */}
              <div className="mt-7 rounded-2xl border border-white/15 bg-white/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-100">
                  Your live preview
                </p>

                <h3 className="mt-3 text-lg font-bold">
                  {form.title || "Your food donation"}
                </h3>

                <p className="mt-1 text-sm text-emerald-100">
                  {form.foodType} · {form.quantity || "0"} {form.unit}
                </p>

                <div className="mt-4 flex items-start gap-2 text-sm text-emerald-50">
                  <MapPin size={17} className="mt-0.5 shrink-0" />

                  <span>
                    {form.pickupAddress || "Pickup address will appear here"}
                  </span>
                </div>
              </div>
            </div>

            {/* Before Publishing */}
            <div className="rounded-3xl border border-white/10 bg-[#101815] p-6 shadow-lg shadow-black/20">
              <h3 className="font-bold text-white">
                Before you publish
              </h3>

              <ul className="mt-4 space-y-3 text-sm text-gray-400">
                {[
                  "Make sure the food is safe to consume.",
                  "Enter an accurate quantity and expiry time.",
                  "Keep the pickup location clear.",
                  "Store the food appropriately until collection.",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckCircle2
                      size={18}
                      className="shrink-0 text-emerald-400"
                    />

                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}