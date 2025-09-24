import React, { useState } from "react";
import { Link } from "react-router-dom";

const VolunteerSection = () => {
  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <section id="volunteer" className="py-16 md:py-24 bg-background text-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
            Become a Volunteer
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto mb-6"></div>
          <p className="text-xl text-mutedSecondary max-w-3xl mx-auto">
            Join our team of passionate volunteers and play a crucial role in
            making the Zang Global Product Launch a tremendous success!
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-center">
          {/* Left Column - Benefits */}
          <div className="lg:w-1/2">
            <div className="bg-mutedSecondary bg-opacity-10 backdrop-blur-sm rounded-xl p-6 md:p-8">
              <h3 className="text-2xl font-semibold text-secondary mb-6">
                Why Volunteer With Us?
              </h3>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-secondary mb-1">
                      Network with Industry Leaders
                    </h4>
                    <p className="text-mutedSecondary">
                      Connect with professionals, innovators, and like-minded
                      individuals in your field.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-secondary mb-1">
                      Gain Valuable Experience
                    </h4>
                    <p className="text-mutedSecondary">
                      Develop new skills and add a prestigious event to your
                      portfolio.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-secondary mb-1">
                      Exclusive Volunteer Benefits
                    </h4>
                    <p className="text-mutedSecondary">
                      Receive a volunteer kit, certificate of participation,
                      meals during shifts, and special recognition.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-secondary mb-1">
                      Flexible Roles
                    </h4>
                    <p className="text-mutedSecondary">
                      Choose from various roles that match your skills,
                      interests, and availability.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Volunteer Roles Overview */}
            <div className="mt-8 bg-mutedSecondary bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-xl font-semibold text-secondary mb-4">
                Available Volunteer Roles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Event Logistics",
                  "Guest Registration",
                  "Speaker Support",
                  "Exhibition Assistance",
                  "Social Media",
                  "Photography/Videography",
                  "Crowd Management",
                  "Information Desk",
                  "Merchandise",
                ].map((role, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-accent rounded-full mr-2"></div>
                    <span className="text-mutedSecondary text-sm">{role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - CTA and Form */}
          <div className="lg:w-1/2">
            <div className="bg-mutedSecondary rounded-xl shadow-lg p-6 md:p-8">
              {!showForm ? (
                <>
                  <h3 className="text-2xl font-semibold text-primary mb-4">
                    Make a Difference
                  </h3>
                  <p className="text-gray-800 mb-6">
                    We're looking for enthusiastic individuals to join our
                    volunteer team for the Zang Global Product Launch,
                    Exhibition & Fundraising event on November 2nd, 2025 in Jos.
                  </p>

                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-primary mb-2">
                      Volunteer Requirements:
                    </h4>
                    <ul className="list-disc pl-5 text-gray-800 space-y-1">
                      <li>Minimum age: 18 years</li>
                      <li>Availability on event day (November 2nd, 2025)</li>
                      <li>Good communication skills</li>
                      <li>Positive attitude and team spirit</li>
                      <li>Commitment to assigned shifts</li>
                    </ul>
                  </div>

                  <div className="bg-primary bg-opacity-10 p-4 rounded-lg mb-6">
                    <h4 className="text-lg font-medium text-primary mb-2">
                      What You'll Receive:
                    </h4>
                    <ul className="list-disc pl-5 text-gray-800 space-y-1">
                      <li>Official volunteer t-shirt</li>
                      <li>Certificate of appreciation</li>
                      <li>Meals during your shift</li>
                      <li>Networking opportunities</li>
                      <li>Letter of recommendation (upon request)</li>
                    </ul>
                  </div>

                  <Link
                  to={"/volunteer-registration"}
                    className="w-full py-3 px-4 bg-primary hover:bg-mutedPrimary text-white font-semibold rounded-lg shadow-md transition-colors duration-300 transform hover:scale-105"
                  >
                    Join Our Volunteer Team
                  </Link>
                </>
              ) : (
                <div>
                  <h3 className="text-2xl font-semibold text-primary mb-6">
                    Volunteer Application
                  </h3>

                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-3 text-gray-800 border"
                        placeholder="Your full name"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-3 text-gray-800 border"
                          placeholder="Your email"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          WhatsApp Number *
                        </label>
                        <input
                          type="tel"
                          required
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-3 text-gray-800 border"
                          placeholder="Your WhatsApp number"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Area of Interest
                      </label>
                      <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-3 text-gray-800 border">
                        <option>Select preferred role</option>
                        <option>Event Logistics</option>
                        <option>Guest Registration</option>
                        <option>Speaker Support</option>
                        <option>Exhibition Assistance</option>
                        <option>Social Media</option>
                        <option>Photography/Videography</option>
                        <option>Crowd Management</option>
                        <option>Information Desk</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Why do you want to volunteer? *
                      </label>
                      <textarea
                        rows={3}
                        required
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-3 text-gray-800 border"
                        placeholder="Share your motivation for volunteering..."
                      />
                    </div>

                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={toggleForm}
                        className="px-4 py-2 bg-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-400 flex-1"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-primary text-white font-medium rounded-md hover:bg-mutedPrimary flex-1"
                      >
                        Submit Application
                      </button>
                    </div>
                  </form>

                  <p className="text-xs text-gray-600 mt-4">
                    By applying, you agree to our volunteer terms and
                    conditions. Full application form will be sent after this
                    initial expression of interest.
                  </p>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="bg-primary bg-opacity-20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-secondary">50+</div>
                <div className="text-sm text-mutedSecondary">
                  Volunteers Needed
                </div>
              </div>
              <div className="bg-primary bg-opacity-20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-secondary">12</div>
                <div className="text-sm text-mutedSecondary">
                  Different Roles
                </div>
              </div>
              <div className="bg-primary bg-opacity-20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-secondary">2</div>
                <div className="text-sm text-mutedSecondary">
                  Weeks Training
                </div>
              </div>
            </div>
          </div>
        </div>

       
      </div>
    </section>
  );
};

export default VolunteerSection;
