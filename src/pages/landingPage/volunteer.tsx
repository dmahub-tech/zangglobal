import React, { useState, useEffect } from "react";
import api from "../../config/api";

const VolunteerRegistration = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    whatsapp: "",
    residence: "",
    ageRange: "",
    occupation: "",
    roles: [],
    motivation: "",
    experience: "",
    experienceDetails: "",
    availability: "",
    shirtSize: "",
    emergencyContact: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Validation rules
  const validationRules = {
    fullName: {
      required: true,
      minLength: 2,
      maxLength: 100,
      pattern: /^[a-zA-Z\s'-]+$/,
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    phone: {
      required: false,
      pattern: /^[\+]?[0-9\s\-\(\)]{10,}$/,
    },
    whatsapp: {
      required: true,
      pattern: /^[\+]?[0-9\s\-\(\)]{10,}$/,
    },
    residence: {
      required: true,
      minLength: 2,
      maxLength: 100,
    },
    ageRange: {
      required: true,
    },
    roles: {
      required: true,
      minItems: 1,
    },
    availability: {
      required: true,
    },
    emergencyContact: {
      required: true,
      minLength: 5,
      maxLength: 200,
    },
  };

  // Validation messages
  const validationMessages = {
    fullName: {
      required: "Full name is required",
      minLength: "Name must be at least 2 characters long",
      maxLength: "Name cannot exceed 100 characters",
      pattern:
        "Name can only contain letters, spaces, hyphens, and apostrophes",
    },
    email: {
      required: "Email address is required",
      pattern: "Please enter a valid email address",
    },
    phone: {
      pattern: "Please enter a valid phone number",
    },
    whatsapp: {
      required: "WhatsApp number is required",
      pattern: "Please enter a valid WhatsApp number",
    },
    residence: {
      required: "City & State of residence is required",
      minLength: "Residence must be at least 2 characters long",
      maxLength: "Residence cannot exceed 100 characters",
    },
    ageRange: {
      required: "Please select your age range",
    },
    roles: {
      required: "Please select at least one volunteer role",
      minItems: "Please select at least one volunteer role",
    },
    availability: {
      required: "Please select your availability",
    },
    emergencyContact: {
      required: "Emergency contact information is required",
      minLength: "Emergency contact must be at least 5 characters long",
      maxLength: "Emergency contact cannot exceed 200 characters",
    },
  };

  // Validate individual field
  const validateField = (name, value) => {
    const rules = validationRules[name];
    if (!rules) return "";

    // Handle array fields (roles)
    if (name === "roles") {
      if (rules.required && (!value || value.length === 0)) {
        return validationMessages[name].required;
      }
      if (rules.minItems && value.length < rules.minItems) {
        return validationMessages[name].minItems;
      }
      return "";
    }

    // Required validation
    if (rules.required && (!value || value.toString().trim() === "")) {
      return validationMessages[name].required;
    }

    // Skip other validations if field is empty and not required
    if (!rules.required && (!value || value.toString().trim() === "")) {
      return "";
    }

    // Min length validation
    if (rules.minLength && value.length < rules.minLength) {
      return validationMessages[name].minLength;
    }

    // Max length validation
    if (rules.maxLength && value.length > rules.maxLength) {
      return validationMessages[name].maxLength;
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value)) {
      return validationMessages[name].pattern;
    }

    return "";
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors = {};

    Object.keys(validationRules).forEach((fieldName) => {
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    return newErrors;
  };

  // Handle input change with validation
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      const updatedRoles = checked
        ? [...formData.roles, value]
        : formData.roles.filter((role) => role !== value);

      setFormData((prevData) => ({
        ...prevData,
        [name]: updatedRoles,
      }));

      // Validate roles
      if (touched[name]) {
        const error = validateField(name, updatedRoles);
        setErrors((prev) => ({
          ...prev,
          [name]: error,
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));

      // Real-time validation for touched fields
      if (touched[name]) {
        const error = validateField(name, value);
        setErrors((prev) => ({
          ...prev,
          [name]: error,
        }));
      }
    }

    // Clear submit error when user starts typing
    if (submitError) {
      setSubmitError("");
    }
  };

  // Handle field blur (when user leaves field)
  const handleBlur = (e) => {
    const { name } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Validate field on blur
    const error = validateField(name, formData[name]);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    // Mark all fields as touched
    const allTouched = {};
    Object.keys(validationRules).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    // Validate entire form
    const formErrors = validateForm();
    setErrors(formErrors);

    // If there are validation errors, don't submit
    if (Object.keys(formErrors).length > 0) {
      setIsSubmitting(false);
      setSubmitError("Please fix the errors above before submitting.");

      // Focus on first error field
      const firstErrorField = Object.keys(formErrors)[0];
      const errorElement = document.getElementById(firstErrorField);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        errorElement.focus();
      }

      return;
    }

    try {
      const response = await api.post("/volunteer", formData);
      console.log("Volunteer form submitted successfully:", response);
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting form:", err);
      setSubmitError(
        err.response?.data?.message ||
          "An error occurred while submitting your application. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get field className based on validation state
  const getFieldClassName = (fieldName, baseClass) => {
    const hasError = touched[fieldName] && errors[fieldName];
    const isValid =
      touched[fieldName] && !errors[fieldName] && formData[fieldName];

    let className = baseClass;

    if (hasError) {
      className += " border-red-500 focus:border-red-500 focus:ring-red-500";
    } else if (isValid) {
      className +=
        " border-green-500 focus:border-green-500 focus:ring-green-500";
    } else {
      className += " border-gray-300 focus:border-primary focus:ring-primary";
    }

    return className;
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background text-white flex items-center justify-center px-4">
        <div className="bg-mutedSecondary rounded-xl shadow-lg p-8 max-w-2xl w-full text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
            Application Received!
          </h2>
          <p className="text-lg text-gray-800 mb-6">
            Thank you for applying to volunteer with Zang Global. Our team will
            review your application and contact you with next steps.
          </p>
          <p className="text-gray-800 font-semibold">
            Together, we will power innovation and create impact.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
            Join Our Volunteer Team
          </h1>
          <p className="text-xl text-mutedSecondary mb-6">
            Product Launch, Exhibition & Fundraising - November 2nd, 2025
          </p>
          <div className="bg-mutedSecondary bg-opacity-20 rounded-lg p-6">
            <p className="text-mutedSecondary">
              We are calling on passionate, skilled, and dedicated individuals
              to join our volunteer team for this landmark event. Your support
              will help us deliver a world-class experience and advance Zang
              Global's mission of innovation, sustainability, and impact.
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-mutedSecondary rounded-xl shadow-lg p-6 md:p-8">
          {submitError && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {submitError}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-primary mb-1"
              >
                Full Name *
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getFieldClassName(
                  "fullName",
                  "w-full rounded-md shadow-sm focus:ring focus:ring-opacity-50 p-3 text-gray-800"
                )}
                placeholder="Enter your full name"
                aria-describedby={
                  errors.fullName ? "fullName-error" : undefined
                }
              />
              {touched.fullName && errors.fullName && (
                <p
                  id="fullName-error"
                  className="mt-1 text-sm text-red-600 flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-primary mb-1"
              >
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getFieldClassName(
                  "email",
                  "w-full rounded-md shadow-sm focus:ring focus:ring-opacity-50 p-3 text-gray-800"
                )}
                placeholder="Enter your email address"
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {touched.email && errors.email && (
                <p
                  id="email-error"
                  className="mt-1 text-sm text-red-600 flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone and WhatsApp */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-primary mb-1"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getFieldClassName(
                    "phone",
                    "w-full rounded-md shadow-sm focus:ring focus:ring-opacity-50 p-3 text-gray-800"
                  )}
                  placeholder="Your phone number"
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                />
                {touched.phone && errors.phone && (
                  <p
                    id="phone-error"
                    className="mt-1 text-sm text-red-600 flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.phone}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="whatsapp"
                  className="block text-sm font-medium text-primary mb-1"
                >
                  WhatsApp Number *
                </label>
                <input
                  type="tel"
                  id="whatsapp"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getFieldClassName(
                    "whatsapp",
                    "w-full rounded-md shadow-sm focus:ring focus:ring-opacity-50 p-3 text-gray-800"
                  )}
                  placeholder="Your WhatsApp number"
                  aria-describedby={
                    errors.whatsapp ? "whatsapp-error" : undefined
                  }
                />
                {touched.whatsapp && errors.whatsapp && (
                  <p
                    id="whatsapp-error"
                    className="mt-1 text-sm text-red-600 flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.whatsapp}
                  </p>
                )}
              </div>
            </div>

            {/* Residence */}
            <div>
              <label
                htmlFor="residence"
                className="block text-sm font-medium text-primary mb-1"
              >
                City & State of Residence *
              </label>
              <input
                type="text"
                id="residence"
                name="residence"
                value={formData.residence}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getFieldClassName(
                  "residence",
                  "w-full rounded-md shadow-sm focus:ring focus:ring-opacity-50 p-3 text-gray-800"
                )}
                placeholder="e.g., Jos, Plateau State"
                aria-describedby={
                  errors.residence ? "residence-error" : undefined
                }
              />
              {touched.residence && errors.residence && (
                <p
                  id="residence-error"
                  className="mt-1 text-sm text-red-600 flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.residence}
                </p>
              )}
            </div>

            {/* Age Range */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Age Range *
              </label>
              <div className="space-y-2">
                {["18–25", "26–35", "36+"].map((range) => (
                  <div key={range} className="flex items-center">
                    <input
                      id={`age-${range}`}
                      name="ageRange"
                      type="radio"
                      value={range}
                      checked={formData.ageRange === range}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="focus:ring-primary h-4 w-4 text-primary border-gray-300"
                    />
                    <label
                      htmlFor={`age-${range}`}
                      className="ml-3 block text-sm text-primary"
                    >
                      {range}
                    </label>
                  </div>
                ))}
              </div>
              {touched.ageRange && errors.ageRange && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.ageRange}
                </p>
              )}
            </div>

            {/* Occupation */}
            <div>
              <label
                htmlFor="occupation"
                className="block text-sm font-medium text-primary mb-1"
              >
                Occupation / Area of Expertise
              </label>
              <input
                type="text"
                id="occupation"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-3 text-gray-800"
                placeholder="What do you do?"
              />
            </div>

            {/* Preferred Volunteer Roles */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Preferred Volunteer Role(s) (select one or more) *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Sponsorships & Partnerships",
                  "Media, Graphics & Branding",
                  "Sound Engineering / Editing / Video Editing",
                  "Voiceover",
                  "Content Creation",
                  "Copywriting",
                  "Logistics",
                  "Protocol",
                  "Welfare",
                  "Venue Management Team",
                  "Security, Safety & Traffic Control",
                  "Social Media Management",
                  "Publicity & Promotion Team",
                  "Speaker Management",
                ].map((role) => (
                  <div key={role} className="flex items-start">
                    <input
                      id={`role-${role}`}
                      name="roles"
                      type="checkbox"
                      value={role}
                      checked={formData.roles.includes(role)}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded mt-1"
                    />
                    <label
                      htmlFor={`role-${role}`}
                      className="ml-2 block text-xs text-primary"
                    >
                      {role}
                    </label>
                  </div>
                ))}
              </div>
              {touched.roles && errors.roles && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.roles}
                </p>
              )}
            </div>

            {/* Motivation */}
            <div>
              <label
                htmlFor="motivation"
                className="block text-sm font-medium text-primary mb-1"
              >
                Why would you like to volunteer for this event?
              </label>
              <textarea
                id="motivation"
                name="motivation"
                value={formData.motivation}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={3}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-3 text-gray-800"
                placeholder="Share your motivation for volunteering..."
              />
            </div>

            {/* Prior Experience */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Do you have prior volunteering or event experience?
              </label>
              <div className="flex space-x-4 mb-3">
                <div className="flex items-center">
                  <input
                    id="experience-yes"
                    name="experience"
                    type="radio"
                    value="yes"
                    checked={formData.experience === "yes"}
                    onChange={handleChange}
                    className="focus:ring-primary h-4 w-4 text-primary border-gray-300"
                  />
                  <label
                    htmlFor="experience-yes"
                    className="ml-2 block text-sm text-primary"
                  >
                    Yes
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="experience-no"
                    name="experience"
                    type="radio"
                    value="no"
                    checked={formData.experience === "no"}
                    onChange={handleChange}
                    className="focus:ring-primary h-4 w-4 text-primary border-gray-300"
                  />
                  <label
                    htmlFor="experience-no"
                    className="ml-2 block text-sm text-primary"
                  >
                    No
                  </label>
                </div>
              </div>
              <textarea
                id="experienceDetails"
                name="experienceDetails"
                value={formData.experienceDetails}
                onChange={handleChange}
                rows={2}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-3 text-gray-800"
                placeholder="Please elaborate on your experience..."
                disabled={formData.experience !== "yes"}
              />
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Availability *
              </label>
              <div className="space-y-2">
                {[
                  "Full-day on November 2nd",
                  "Partial-day on November 2nd",
                  "Available before and during the event",
                ].map((option) => (
                  <div key={option} className="flex items-center">
                    <input
                      id={`availability-${option}`}
                      name="availability"
                      type="radio"
                      value={option}
                      checked={formData.availability === option}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="focus:ring-primary h-4 w-4 text-primary border-gray-300"
                    />
                    <label
                      htmlFor={`availability-${option}`}
                      className="ml-3 block text-sm text-primary"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
              {touched.availability && errors.availability && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.availability}
                </p>
              )}
            </div>

            {/* T-shirt Size */}
            <div>
              <label
                htmlFor="shirtSize"
                className="block text-sm font-medium text-primary mb-1"
              >
                T-shirt Size (for branded volunteer wear)
              </label>
              <select
                id="shirtSize"
                name="shirtSize"
                value={formData.shirtSize}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-3 text-gray-800"
              >
                <option value="">Select your size</option>
                {["S", "M", "L", "XL", "XXL"].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            {/* Emergency Contact */}
            <div>
              <label
                htmlFor="emergencyContact"
                className="block text-sm font-medium text-primary mb-1"
              >
                Emergency Contact Name & Phone *
              </label>
              <input
                type="text"
                id="emergencyContact"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getFieldClassName(
                  "emergencyContact",
                  "w-full rounded-md shadow-sm focus:ring focus:ring-opacity-50 p-3 text-gray-800"
                )}
                placeholder="Name and phone number of emergency contact"
                aria-describedby={
                  errors.emergencyContact ? "emergencyContact-error" : undefined
                }
              />
              {touched.emergencyContact && errors.emergencyContact && (
                <p
                  id="emergencyContact-error"
                  className="mt-1 text-sm text-red-600 flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.emergencyContact}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-primary hover:bg-mutedPrimary disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Apply to Volunteer"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VolunteerRegistration;
