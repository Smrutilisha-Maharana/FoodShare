import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Utensils, Users } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
const [formData, setFormData] = useState({
name: "",
email: "",
phone: "",
password: "",
role: "donor",
});

const navigate = useNavigate();
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

const handleChange = (e) => {
setFormData({
...formData,
[e.target.name]: e.target.value,
});
};



const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");
  setLoading(true);

  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/register",
      formData
    );

    localStorage.setItem("token", response.data.token);

    localStorage.setItem(
      "user",
      JSON.stringify(response.data.user)
    );

    alert("Registration successful!");

    if (response.data.user.role === "ngo") {
      navigate("/ngo/dashboard");
    } else {
      navigate("/donor/dashboard");
    }
  } catch (error) {
    setError(
      error.response?.data?.message ||
      "Unable to register. Please try again."
    );
  } finally {
    setLoading(false);
  }
};
return ( <div className="grid min-h-screen w-full bg-white md:grid-cols-2">

  {/* Left Section */}
  <div className="hidden flex-col justify-center bg-green-700 p-12 text-white md:flex">
    <Heart size={60} />

    <h1 className="mt-8 text-5xl font-bold">
      Share Food,
      <br />
      Spread Hope.
    </h1>

    <p className="mt-6 max-w-md text-lg text-green-100">
      Join FoodShare and help connect surplus food with
      communities that need it.
    </p>

    <div className="mt-10 flex gap-6">
      <div>
        <Utensils size={30} />
        <p className="mt-2">Donate Food</p>
      </div>

      <div>
        <Users size={30} />
        <p className="mt-2">Help Communities</p>
      </div>
    </div>
  </div>

  {/* Registration Form */}
  <div className="flex items-center justify-center p-6 sm:p-12">
    <div className="w-full max-w-md">

      <Link
        to="/"
        className="font-bold text-green-700"
      >
        ← FoodShare
      </Link>
      {error && (
  <p className="text-sm text-red-600" role="alert">
    {error}
  </p>
)}

      <h2 className="mt-8 text-3xl font-bold">
        Create an account
      </h2>

      <p className="mt-2 text-gray-500">
        Join our food donation community.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">

        <div>
          <label className="mb-2 block text-sm font-medium">
            Full Name / Organization Name
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Email Address
          </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Phone Number
          </label>

          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Register As
          </label>

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
          >
            <option value="donor">Food Donor</option>
            <option value="ngo">NGO</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Password
          </label>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            minLength={8}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
          />
        </div>

        <button
  type="submit"
  disabled={loading}
  className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
>
  {loading ? "Creating Account..." : "Create Account"}
</button>

      </form>

      <p className="mt-6 text-center text-gray-600">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-green-700"
        >
          Login
        </Link>
      </p>

    </div>
  </div>

</div>

);
}

export default Register;
