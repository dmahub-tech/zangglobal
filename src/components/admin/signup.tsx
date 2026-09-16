import React, { useState } from "react";
import { Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/Admin";

const AdminSignup = () => {
  const navigate = useNavigate();
  const { register, error: authError, loading } = useAdminAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const error = authError || localError;

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "phoneNumber") {
      // Only allow numbers and limit to 11 digits
      const numericValue = value.replace(/\D/g, "").slice(0, 11);
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phoneNumber || !formData.password) {
      setLocalError("Please fill all fields");
      return;
    }

    if (formData.phoneNumber.length < 11) {
      setLocalError("Please enter a valid 11-digit phone number");
      return;
    }

    try {
      await register(formData);
    } catch (err) {
      console.error("Registration error:", err);
      setLocalError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="max-w-md mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden sm:max-w-lg lg:max-w-xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            type: "spring",
            stiffness: 120,
          }}
        >
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                Admin Signup
              </h2>
              <p className="text-mutedPrimary mt-2 text-sm sm:text-base">
                Create your Admin Account
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-mutedPrimary text-primary px-3 py-2 sm:px-4 sm:py-3 rounded-lg mb-4 sm:mb-6 text-center text-sm sm:text-base">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="text-primary w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  required
                  className="w-full pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border border-mutedPrimary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="text-primary w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  required
                  className="w-full pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border border-mutedPrimary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="text-primary w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Phone Number (e.g., 08012345678)"
                  required
                  pattern="[0-9]{11}"
                  inputMode="numeric"
                  className="w-full pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border border-mutedPrimary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="text-primary w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  required
                  className="w-full pl-10 pr-12 py-2 sm:py-3 text-sm sm:text-base border border-mutedPrimary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-primary hover:text-secondary transition"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <motion.button
                type="submit"
                className="w-full bg-primary text-white py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-mutedPrimary transition duration-300 transform active:scale-95"
                whileTap={{ scale: 0.95 }}
                disabled={loading}
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </motion.button>

              <div className="text-center mt-4">
                <p className="text-gray-600 text-sm sm:text-base">
                  Already have an account?{" "}
                  <Link
                    to="/admin/login"
                    className="text-primary hover:text-secondary font-semibold"
                  >
                    Login here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminSignup;