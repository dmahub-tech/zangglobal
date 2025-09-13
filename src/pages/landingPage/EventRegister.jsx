// EventRegister.js
import React, { useState } from "react";
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/attendance", {formData
      });
      console.log("Response:", response);   
    } catch (error) {
      console.error("Error:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-mutedSecondary rounded-lg shadow-lg p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary">Zang Global</h1>
            <h2 className="text-xl text-accent mt-2">
              Product Launch, Exhibition & Fundraising
            </h2>
            <p className="text-primary mt-4">Date: 2nd October, 2025</p>
            <p className="text-primary">
              Venue: Usiju World Event Centre, Off State Secretariat Junction by
              Apollo Crescent, Jos.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-primary"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2 text-gray-800"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-primary"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2 text-gray-800"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-primary"
              >
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2 text-gray-800"
              />
            </div>

            <div>
              <label
                htmlFor="organization"
                className="block text-sm font-medium text-primary"
              >
                Organization / Company
              </label>
              <input
                type="text"
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2 text-gray-800"
              />
            </div>

            <div>
              <label
                htmlFor="position"
                className="block text-sm font-medium text-primary"
              >
                Position / Title
              </label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2 text-gray-800"
              />
            </div>

            <div>
              <label
                htmlFor="residence"
                className="block text-sm font-medium text-primary"
              >
                Country / City of Residence *
              </label>
              <input
                type="text"
                id="residence"
                name="residence"
                value={formData.residence}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2 text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary">
                Category of Participation *
              </label>
              <div className="mt-2 space-y-2">
                {[
                  "Guest / Attendee",
                  "Exhibitor",
                  "Sponsor / Partner",
                  "Media Representative",
                ].map((option) => (
                  <div key={option} className="flex items-center">
                    <input
                      id={`category-${option}`}
                      name="category"
                      type="radio"
                      value={option}
                      checked={formData.category === option}
                      onChange={handleChange}
                      required
                      className="focus:ring-primary h-4 w-4 text-primary border-gray-300"
                    />
                    <label
                      htmlFor={`category-${option}`}
                      className="ml-3 block text-sm font-medium text-primary"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary">
                Will you attend in person or virtually? *
              </label>
              <div className="mt-2 space-y-2">
                {["In Person", "Virtual (Livestream Access)"].map((option) => (
                  <div key={option} className="flex items-center">
                    <input
                      id={`attendance-${option}`}
                      name="attendance"
                      type="radio"
                      value={option}
                      checked={formData.attendance === option}
                      onChange={handleChange}
                      required
                      className="focus:ring-primary h-4 w-4 text-primary border-gray-300"
                    />
                    <label
                      htmlFor={`attendance-${option}`}
                      className="ml-3 block text-sm font-medium text-primary"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="source"
                className="block text-sm font-medium text-primary"
              >
                How did you hear about this event? *
              </label>
              <input
                type="text"
                id="source"
                name="source"
                value={formData.source}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2 text-gray-800"
              />
            </div>

            <div className="flex items-center">
              <input
                id="updates"
                name="updates"
                type="checkbox"
                checked={formData.updates}
                onChange={handleChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label
                htmlFor="updates"
                className="ml-2 block text-sm text-primary"
              >
                Would you like to receive updates on Zang Global projects and
                initiatives?
              </label>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-mutedPrimary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Register Now
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EventRegister;
