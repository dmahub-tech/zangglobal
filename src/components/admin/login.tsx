import React, { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/Admin";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, error: authError, loading } = useAdminAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const error = authError || localError;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setLocalError("Please fill all fields");
      return;
    }

    try {
      await login(formData.email, formData.password);
      // On successful login, the AuthContext will handle navigation
    } catch (err) {
      console.error("Login error:", err);
      setLocalError("Login failed. Please check your credentials.");
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login | Zang Global</title>
      </Helmet>
      
      <div className="h-screen bg-slate-100 flex items-center justify-center p-4">
        <motion.div
          className="w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            type: "spring",
            stiffness: 120,
          }}
        >
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                Admin Login
              </h2>
              <p className="text-mutedPrimary mt-2">
                Log in to Admin Dashboard
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="text-primary" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="text-primary" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  required
                  className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-primary hover:text-mutedPrimary transition"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <motion.button
                type="submit"
                className="w-full bg-primary hover:bg-mutedPrimary text-white py-3 rounded-lg font-semibold transition duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                whileTap={{ scale: 0.95 }}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </motion.button>
            </form>

            <div className="mt-4 text-center">
              <Link 
                to="/admin/forgot-password" 
                className="text-primary hover:text-mutedPrimary text-sm"
              >
                Forgot password?
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AdminLogin;