import React, { useState } from "react";
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

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      // Handle multiple selections for volunteer roles
      const updatedRoles = checked
        ? [...formData.roles, value]
        : formData.roles.filter((role) => role !== value);

      setFormData((prevData) => ({
        ...prevData,
        [name]: updatedRoles,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try{
          const response = await api.post("/volunteer", formData);
    }catch(err){
      console.log(err)
    }
    
    // In a real application, you would send this data to your backend
    console.log("Volunteer form data:", formData);
    setSubmitted(true);
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
            Product Launch, Exhibition & Fundraising - October 26th, 2025
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
          <form onSubmit={handleSubmit} className="space-y-6">
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
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-3 text-gray-800"
                placeholder="Enter your full name"
              />
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
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-3 text-gray-800"
                placeholder="Enter your email address"
              />
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
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-3 text-gray-800"
                  placeholder="Your phone number"
                />
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
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-3 text-gray-800"
                  placeholder="Your WhatsApp number"
                />
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
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-3 text-gray-800"
                placeholder="e.g., Jos, Plateau State"
              />
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
                      required
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
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-3 text-gray-800"
                placeholder="What do you do?"
              />
            </div>

            {/* Preferred Volunteer Roles */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Preferred Volunteer Role(s) (select one or more)
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
                  "Full-day on October 26th",
                  "Partial-day on October 26th",
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
                      required
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
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-3 text-gray-800"
                placeholder="Name and phone number of emergency contact"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-primary hover:bg-mutedPrimary text-white font-semibold rounded-lg shadow-md transition-colors duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Apply to Volunteer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VolunteerRegistration;
