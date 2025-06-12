import React, { useState } from "react";
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/slice/authSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error,setError] = useState()
  const [loading,setLoading] = useState(false)

  // Get authentication state from Redux

  // Handle login submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const resultAction = await dispatch(loginUser({ email, password })).unwrap();
      console.log("Login successful", resultAction);

      // Redirect to Dashboard or Home after login
      navigate("/store"); 
      setLoading(false)
    } catch (err) {
      console.error("Login failed:", err);
      setLoading(false)
      setError(err.message)
    }
  };

  return (
    <>
      {/* <SEOComponent /> */}
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 mt-16">
        
        <motion.div 
          className="w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
        >
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                Welcome Back
              </h2>
              <p className="text-primary mt-2">Log in to Zang Global</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-center">
                {error} please try again
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="text-primary" />
                </div>
                <input
                  type="text"
                  placeholder="Email or Mobile Number"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="text-primary" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  className="w-full pl-10 pr-12 py-3 border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-primary hover:text-primary transition"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                className="w-full bg-primary flex items-center justify-center text-white py-3 rounded-lg font-semibold hover:bg-primary transition duration-300 transform active:scale-95"
                whileTap={{ scale: 0.95 }}
                disabled={loading}
              >
                {loading ? <Loader2 className=" animate-spin" size={25}/> : "Log in"}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Don't have an account? 
                <a href="/signup" className="text-primary hover:text-pink-800 ml-2 font-semibold">
                  Sign Up
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Login;
