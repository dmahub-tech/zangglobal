import React, { useState } from "react";
import { Calendar, MapPin, Building, User, Mail, Phone, Globe, Users, Monitor, CheckCircle, Sparkles, ArrowRight, Star } from "lucide-react";
import api from "../../config/api";

function EventRegister() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    position: "",
    residence: "",
    category: "",
    attendance: "",
    source: "",
    updates: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Please enter a valid email";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.residence.trim())
      newErrors.residence = "Residence is required";
    if (!formData.category) newErrors.category = "Please select a category";
    if (!formData.attendance)
      newErrors.attendance = "Please select attendance type";
    if (!formData.source.trim())
      newErrors.source = "Please tell us how you heard about this event";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const response = await api.post("/attendance", formData);

      console.log("Registration successful:", response.data);
      setIsSuccess(true);

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        organization: "",
        position: "",
        residence: "",
        category: "",
        attendance: "",
        source: "",
        updates: false,
      });
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetSuccess = () => {
    setIsSuccess(false);
  };

  const FloatingParticle = ({ delay, duration, size }) => (
    <div 
      className={`absolute bg-secondary rounded-full opacity-10 animate-pulse`}
      style={{
        width: size,
        height: size,
        animationDelay: delay,
        animationDuration: duration,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
    />
  );

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary rounded-full opacity-30 mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary rounded-full opacity-20 mix-blend-multiply filter blur-xl animate-pulse"></div>
          {[...Array(6)].map((_, i) => (
            <FloatingParticle 
              key={i} 
              delay={`${i * 0.5}s`} 
              duration={`${3 + i * 0.5}s`}
              size={`${8 + Math.random() * 12}px`}
            />
          ))}
        </div>

        <div className="max-w-lg w-full relative z-10">
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-10 text-center shadow-2xl">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-secondary mb-8 shadow-lg">
              <CheckCircle className="h-10 w-10 text-background" />
            </div>
            <h2 className="text-3xl font-black text-secondary mb-6 drop-shadow-lg">
              Registration Successful!
            </h2>
            <p className="text-mutedSecondary mb-8 text-lg leading-relaxed">
              Welcome to the future! We've sent confirmation details to your email. 
              Get ready for an extraordinary experience.
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-center text-accent mb-6">
                <Star className="w-5 h-5 mr-2" />
                <span className="font-semibold">VIP Access Confirmed</span>
                <Star className="w-5 h-5 ml-2" />
              </div>
              <button
                onClick={resetSuccess}
                className="w-full bg-primary hover:bg-mutedPrimary text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
              >
                Register Another Person
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

      return (
    <div className="min-h-screen bg-background py-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary rounded-full opacity-30 mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary rounded-full opacity-20 mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-accent rounded-full opacity-25 mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '4s'}}></div>
        {[...Array(8)].map((_, i) => (
          <FloatingParticle 
            key={i} 
            delay={`${i * 0.5}s`} 
            duration={`${3 + i * 0.5}s`}
            size={`${8 + Math.random() * 16}px`}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Enhanced Event Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-6 py-3 bg-primary rounded-full mb-6 shadow-2xl border border-mutedPrimary/30">
              <Sparkles className="w-5 h-5 mr-2 text-secondary" />
              <span className="text-sm font-bold tracking-wider text-white uppercase">
                Exclusive Event Registration
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black mb-4 text-secondary drop-shadow-lg">
              Join the Revolution
            </h1>
            <p className="text-xl text-mutedSecondary mb-8 max-w-2xl mx-auto">
              Secure your spot at the most anticipated tech event of 2025
            </p>
          </div>

          {/* Event Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center group hover:border-secondary/30 transition-all duration-300">
              <Calendar className="h-8 w-8 text-secondary mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-white mb-1">Nov 2, 2025</h3>
              <p className="text-mutedSecondary text-sm">2:00 PM</p>
            </div>
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center group hover:border-accent/30 transition-all duration-300">
              <MapPin className="h-8 w-8 text-accent mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-white mb-1">Usiju World Centre</h3>
              <p className="text-mutedSecondary text-sm">Jos, Nigeria</p>
            </div>
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center group hover:border-primary/30 transition-all duration-300">
              <Monitor className="h-8 w-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-white mb-1">Hybrid Event</h3>
              <p className="text-mutedSecondary text-sm">In-Person & Virtual</p>
            </div>
          </div>

          {/* Registration Form */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
            <div className="text-center mb-10">
              <h3 className="text-3xl font-bold text-white mb-4">
                Reserve Your <span className="text-secondary">VIP Spot</span>
              </h3>
              <p className="text-mutedSecondary text-lg">
                Fill out the form below to join the exclusive guest list
              </p>
            </div>

            <div className="space-y-8">
              {/* Personal Information Section */}
              <div className="space-y-6">
                <h4 className="text-xl font-bold text-secondary mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Personal Information
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-white">
                      Full Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`w-full px-4 py-4 bg-black/20 border rounded-xl text-white placeholder-mutedSecondary focus:ring-2 focus:ring-secondary focus:border-secondary transition-all duration-300 backdrop-blur-sm ${
                          errors.fullName ? "border-red-400 bg-red-900/20" : "border-white/20"
                        }`}
                        placeholder="Enter your full name"
                      />
                      {errors.fullName && (
                        <p className="mt-2 text-sm text-red-400">{errors.fullName}</p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-white">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-4 h-5 w-5 text-mutedSecondary" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-4 bg-black/20 border rounded-xl text-white placeholder-mutedSecondary focus:ring-2 focus:ring-secondary focus:border-secondary transition-all duration-300 backdrop-blur-sm ${
                          errors.email ? "border-red-400 bg-red-900/20" : "border-white/20"
                        }`}
                        placeholder="your.email@example.com"
                      />
                      {errors.email && (
                        <p className="mt-2 text-sm text-red-400">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-white">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-4 h-5 w-5 text-mutedSecondary" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-4 bg-black/20 border rounded-xl text-white placeholder-mutedSecondary focus:ring-2 focus:ring-secondary focus:border-secondary transition-all duration-300 backdrop-blur-sm ${
                          errors.phone ? "border-red-400 bg-red-900/20" : "border-white/20"
                        }`}
                        placeholder="+234 xxx xxx xxxx"
                      />
                      {errors.phone && (
                        <p className="mt-2 text-sm text-red-400">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Residence */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-white">
                      Country / City *
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-4 h-5 w-5 text-mutedSecondary" />
                      <input
                        type="text"
                        name="residence"
                        value={formData.residence}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-4 bg-black/20 border rounded-xl text-white placeholder-mutedSecondary focus:ring-2 focus:ring-secondary focus:border-secondary transition-all duration-300 backdrop-blur-sm ${
                          errors.residence ? "border-red-400 bg-red-900/20" : "border-white/20"
                        }`}
                        placeholder="Nigeria, Lagos"
                      />
                      {errors.residence && (
                        <p className="mt-2 text-sm text-red-400">{errors.residence}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Organization and Position */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-white">
                      Organization / Company
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-4 h-5 w-5 text-mutedSecondary" />
                      <input
                        type="text"
                        name="organization"
                        value={formData.organization}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 bg-black/20 border border-white/20 rounded-xl text-white placeholder-mutedSecondary focus:ring-2 focus:ring-secondary focus:border-secondary transition-all duration-300 backdrop-blur-sm"
                        placeholder="Your organization"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-white">
                      Position / Title
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      className="w-full px-4 py-4 bg-black/20 border border-white/20 rounded-xl text-white placeholder-mutedSecondary focus:ring-2 focus:ring-secondary focus:border-secondary transition-all duration-300 backdrop-blur-sm"
                      placeholder="Your role/title"
                    />
                  </div>
                </div>
              </div>

              {/* Event Preferences Section */}
              <div className="space-y-6 pt-8 border-t border-white/10">
                <h4 className="text-xl font-bold text-secondary mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Event Preferences
                </h4>

                {/* Category */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-white">
                    Participation Category *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "Guest / Attendee",
                      "Sponsor / Partner",
                      "Media Representative",
                    ].map((option) => (
                      <label key={option} className="relative cursor-pointer group">
                        <input
                          type="radio"
                          name="category"
                          value={option}
                          checked={formData.category === option}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                          formData.category === option 
                            ? "border-secondary bg-secondary/10 text-secondary" 
                            : "border-white/20 bg-black/20 text-mutedSecondary hover:border-secondary/50"
                        }`}>
                          <span className="font-medium">{option}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.category && (
                    <p className="text-sm text-red-400">{errors.category}</p>
                  )}
                </div>

                {/* Attendance */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-white">
                    Attendance Format *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["In Person", "Virtual (Livestream Access)"].map((option) => (
                      <label key={option} className="relative cursor-pointer group">
                        <input
                          type="radio"
                          name="attendance"
                          value={option}
                          checked={formData.attendance === option}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                          formData.attendance === option 
                            ? "border-accent bg-accent/10 text-accent" 
                            : "border-white/20 bg-black/20 text-mutedSecondary hover:border-accent/50"
                        }`}>
                          <span className="font-medium">{option}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.attendance && (
                    <p className="text-sm text-red-400">{errors.attendance}</p>
                  )}
                </div>

                {/* Source */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white">
                    How did you hear about this event? *
                  </label>
                  <input
                    type="text"
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                    className={`w-full px-4 py-4 bg-black/20 border rounded-xl text-white placeholder-mutedSecondary focus:ring-2 focus:ring-secondary focus:border-secondary transition-all duration-300 backdrop-blur-sm ${
                      errors.source ? "border-red-400 bg-red-900/20" : "border-white/20"
                    }`}
                    placeholder="Social media, friend, website, etc."
                  />
                  {errors.source && (
                    <p className="mt-2 text-sm text-red-400">{errors.source}</p>
                  )}
                </div>
              </div>

              {/* Updates Checkbox */}
              <div className="bg-primary/10 backdrop-blur-sm rounded-2xl p-6 border border-primary/20">
                <label className="flex items-start cursor-pointer group">
                  <input
                    type="checkbox"
                    name="updates"
                    checked={formData.updates}
                    onChange={handleChange}
                    className="mt-1 h-5 w-5 text-secondary focus:ring-secondary border-white/30 rounded bg-black/20"
                  />
                  <div className="ml-4">
                    <span className="text-white font-semibold group-hover:text-secondary transition-colors">
                      Stay Connected with Zang Global
                    </span>
                    <p className="text-mutedSecondary mt-1 text-sm">
                      Receive updates on future events, product launches, and exclusive opportunities.
                    </p>
                  </div>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`w-full py-5 px-8 font-bold text-xl rounded-2xl shadow-2xl transition-all duration-300 ${
                    isSubmitting
                      ? "bg-neutralGray cursor-not-allowed text-gray-400"
                      : "bg-accent hover:bg-accent/90 text-white transform hover:-translate-y-1 hover:scale-[1.02] hover:shadow-accent/25"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      Securing Your Spot...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Star className="h-6 w-6 mr-2" />
                      Regiser
                      <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </button>
              </div>

              {/* Privacy Notice */}
              <div className="text-center pt-6 border-t border-white/10">
                <p className="text-sm text-mutedSecondary">
                  Your information is secure and will never be shared with third parties. 
                  By registering, you agree to receive event-related communications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      )
    }

    export default EventRegister