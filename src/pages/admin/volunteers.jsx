import React, { useState, useEffect } from "react";
import api from "../../config/api";

const VolunteersAdmin = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingVolunteer, setEditingVolunteer] = useState(null);
  const [viewingVolunteer, setViewingVolunteer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

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
    status: "pending",
  });

  const volunteerRoles = [
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
  ];

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    approved: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
  };

  const statusIcons = {
    pending: "⏳",
    approved: "✅",
    rejected: "❌",
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/volunteer");
      const volunteer = response.data;
      setVolunteers(volunteer);
    } catch (error) {
      console.error("Error fetching volunteers:", error);
      alert("Failed to fetch volunteers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (volunteer) => {
    setViewingVolunteer(volunteer);
    setShowViewModal(true);
  };

  const handleEdit = (volunteer) => {
    setEditingVolunteer(volunteer._id);
    setFormData({
      fullName: volunteer.fullName,
      email: volunteer.email,
      phone: volunteer.phone,
      whatsapp: volunteer.whatsapp,
      residence: volunteer.residence,
      ageRange: volunteer.ageRange,
      occupation: volunteer.occupation,
      roles: volunteer.roles,
      motivation: volunteer.motivation,
      experience: volunteer.experience,
      experienceDetails: volunteer.experienceDetails,
      availability: volunteer.availability,
      shirtSize: volunteer.shirtSize,
      emergencyContact: volunteer.emergencyContact,
      status: volunteer.status,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this volunteer?")) {
      try {
        setActionLoading(id);
        await api.delete(`/volunteer/${id}`);
        setVolunteers(volunteers.filter((volunteer) => volunteer._id !== id));
        alert("Volunteer deleted successfully");
      } catch (error) {
        console.error("Error deleting volunteer:", error);
        alert("Failed to delete volunteer");
      } finally {
        setActionLoading(null);
      }
    }
  };

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
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setActionLoading("form");

      if (editingVolunteer) {
        const response = await api.put(
          `/volunteer/${editingVolunteer}`,
          formData
        );
        setVolunteers(
          volunteers.map((volunteer) =>
            volunteer._id === editingVolunteer
              ? { ...volunteer, ...formData }
              : volunteer
          )
        );
        alert("Volunteer updated successfully");
      } else {
        const response = await api.post(`/volunteer`, formData);
        const newVolunteer = {
          _id: response.data._id || Date.now().toString(),
          ...formData,
          createdAt: new Date().toISOString(),
        };
        setVolunteers([...volunteers, newVolunteer]);
        alert("Volunteer created successfully");
      }

      closeModal();
    } catch (error) {
      console.error("Error saving volunteer:", error);
      alert("Failed to save volunteer");
    } finally {
      setActionLoading(null);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      setActionLoading(id);
      const response = await api.put(`/volunteer/${id}`, { status });
      setVolunteers(
        volunteers.map((volunteer) =>
          volunteer._id === id ? { ...volunteer, status } : volunteer
        )
      );
      alert(`Volunteer ${status} successfully`);
    } catch (error) {
      console.error("Error updating volunteer status:", error);
      alert("Failed to update volunteer status");
    } finally {
      setActionLoading(null);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingVolunteer(null);
    setFormData({
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
      status: "pending",
    });
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setViewingVolunteer(null);
  };

  // Filter volunteers based on status and search term
  const filteredVolunteers = volunteers.filter((volunteer) => {
    const matchesFilter = filter === "all" || volunteer.status === filter;
    const matchesSearch =
      volunteer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.residence?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">
            Loading volunteers...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Volunteers Management
          </h1>
          <p className="text-gray-600 text-lg">
            Manage all volunteer applications for the Zang Global event
          </p>
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-100 border border-green-200 rounded-full"></div>
              {volunteers.filter((v) => v.status === "approved").length}{" "}
              Approved
            </span>
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded-full"></div>
              {volunteers.filter((v) => v.status === "pending").length} Pending
            </span>
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-100 border border-red-200 rounded-full"></div>
              {volunteers.filter((v) => v.status === "rejected").length}{" "}
              Rejected
            </span>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="min-w-0">
                <label
                  htmlFor="filter"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Filter by Status
                </label>
                <select
                  id="filter"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">
                    All Volunteers ({volunteers.length})
                  </option>
                  <option value="pending">
                    Pending (
                    {volunteers.filter((v) => v.status === "pending").length})
                  </option>
                  <option value="approved">
                    Approved (
                    {volunteers.filter((v) => v.status === "approved").length})
                  </option>
                  <option value="rejected">
                    Rejected (
                    {volunteers.filter((v) => v.status === "rejected").length})
                  </option>
                </select>
              </div>

              <div className="min-w-0 flex-1">
                <label
                  htmlFor="search"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Search Volunteers
                </label>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email, or location..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="whitespace-nowrap px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-colors duration-200 flex items-center gap-2"
            >
              <span className="text-lg">+</span>
              Add New Volunteer
            </button>
          </div>
        </div>

        {/* Volunteers Grid/Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredVolunteers.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">👥</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No volunteers found
              </h3>
              <p className="text-gray-500">
                {searchTerm || filter !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Get started by adding your first volunteer."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Volunteer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact & Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Roles & Availability
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredVolunteers.map((volunteer) => (
                    <tr
                      key={volunteer._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {volunteer.fullName?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {volunteer.fullName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {volunteer.ageRange} •{" "}
                              {volunteer.occupation || "Not specified"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {volunteer.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {volunteer.whatsapp}
                        </div>
                        <div className="text-sm text-gray-500">
                          {volunteer.residence}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 mb-1">
                          {volunteer.availability}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {volunteer.roles?.slice(0, 2).map((role, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {role}
                            </span>
                          ))}
                          {volunteer.roles?.length > 2 && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              +{volunteer.roles.length - 2} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            statusColors[volunteer.status]
                          }`}
                        >
                          <span className="mr-1">
                            {statusIcons[volunteer.status]}
                          </span>
                          {volunteer.status.charAt(0).toUpperCase() +
                            volunteer.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleView(volunteer)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleEdit(volunteer)}
                            className="text-amber-600 hover:text-amber-800 text-sm font-medium transition-colors"
                            disabled={actionLoading === volunteer._id}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(volunteer._id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                            disabled={actionLoading === volunteer._id}
                          >
                            {actionLoading === volunteer._id ? "..." : "Delete"}
                          </button>
                          {volunteer.status !== "approved" && (
                            <button
                              onClick={() =>
                                updateStatus(volunteer._id, "approved")
                              }
                              className="text-green-600 hover:text-green-800 text-sm font-medium transition-colors"
                              disabled={actionLoading === volunteer._id}
                            >
                              Approve
                            </button>
                          )}
                          {volunteer.status !== "rejected" && (
                            <button
                              onClick={() =>
                                updateStatus(volunteer._id, "rejected")
                              }
                              className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                              disabled={actionLoading === volunteer._id}
                            >
                              Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* View Volunteer Modal */}
        {showViewModal && viewingVolunteer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-screen overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-lg font-medium text-blue-600">
                        {viewingVolunteer.fullName?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {viewingVolunteer.fullName}
                      </h2>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          statusColors[viewingVolunteer.status]
                        } mt-1`}
                      >
                        <span className="mr-1">
                          {statusIcons[viewingVolunteer.status]}
                        </span>
                        {viewingVolunteer.status.charAt(0).toUpperCase() +
                          viewingVolunteer.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={closeViewModal}
                    className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      Contact Information
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">
                          Email:
                        </span>
                        <span className="ml-2 text-gray-900">
                          {viewingVolunteer.email}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Phone:
                        </span>
                        <span className="ml-2 text-gray-900">
                          {viewingVolunteer.phone || "Not provided"}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          WhatsApp:
                        </span>
                        <span className="ml-2 text-gray-900">
                          {viewingVolunteer.whatsapp}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Location:
                        </span>
                        <span className="ml-2 text-gray-900">
                          {viewingVolunteer.residence}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Emergency Contact:
                        </span>
                        <span className="ml-2 text-gray-900">
                          {viewingVolunteer.emergencyContact}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      Personal Details
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">
                          Age Range:
                        </span>
                        <span className="ml-2 text-gray-900">
                          {viewingVolunteer.ageRange}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Occupation:
                        </span>
                        <span className="ml-2 text-gray-900">
                          {viewingVolunteer.occupation || "Not specified"}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          T-shirt Size:
                        </span>
                        <span className="ml-2 text-gray-900">
                          {viewingVolunteer.shirtSize || "Not specified"}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Availability:
                        </span>
                        <span className="ml-2 text-gray-900">
                          {viewingVolunteer.availability}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Volunteer Roles */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                    Preferred Volunteer Roles
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {viewingVolunteer.roles?.map((role, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {role}
                      </span>
                    )) || (
                      <span className="text-gray-500">No roles specified</span>
                    )}
                  </div>
                </div>

                {/* Motivation */}
                {viewingVolunteer.motivation && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                      Motivation
                    </h3>
                    <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                      {viewingVolunteer.motivation}
                    </p>
                  </div>
                )}

                {/* Experience */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                    Experience
                  </h3>
                  <div className="text-sm space-y-2">
                    <div>
                      <span className="font-medium text-gray-700">
                        Has prior experience:
                      </span>
                      <span className="ml-2 text-gray-900">
                        {viewingVolunteer.experience === "yes" ? "Yes" : "No"}
                      </span>
                    </div>
                    {viewingVolunteer.experienceDetails && (
                      <div className="mt-2">
                        <span className="font-medium text-gray-700">
                          Details:
                        </span>
                        <p className="mt-1 text-gray-700 bg-gray-50 p-3 rounded-lg">
                          {viewingVolunteer.experienceDetails}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={closeViewModal}
                    className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      closeViewModal();
                      handleEdit(viewingVolunteer);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Edit Volunteer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Volunteer Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-screen overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingVolunteer ? "Edit Volunteer" : "Add New Volunteer"}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* WhatsApp */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Residence */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City & State of Residence *
                    </label>
                    <input
                      type="text"
                      name="residence"
                      value={formData.residence}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Age Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age Range *
                    </label>
                    <select
                      name="ageRange"
                      value={formData.ageRange}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Select age range</option>
                      <option value="18–25">18–25</option>
                      <option value="26–35">26–35</option>
                      <option value="36+">36+</option>
                    </select>
                  </div>

                  {/* Occupation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Occupation / Area of Expertise
                    </label>
                    <input
                      type="text"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* T-shirt Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      T-shirt Size
                    </label>
                    <select
                      name="shirtSize"
                      value={formData.shirtSize}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Select size</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                    </select>
                  </div>

                  {/* Availability */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Availability *
                    </label>
                    <select
                      name="availability"
                      value={formData.availability}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Select availability</option>
                      <option value="Full-day on October 26th">
                        Full-day on October 26th
                      </option>
                      <option value="Partial-day on October 26th">
                        Partial-day on October 26th
                      </option>
                      <option value="Available before and during the event">
                        Available before and during the event
                      </option>
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact Name & Phone *
                  </label>
                  <input
                    type="text"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Name and phone number of emergency contact"
                  />
                </div>

                {/* Volunteer Roles */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Preferred Volunteer Role(s)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-4">
                    {volunteerRoles.map((role) => (
                      <div key={role} className="flex items-center">
                        <input
                          id={`modal-role-${role}`}
                          name="roles"
                          type="checkbox"
                          value={role}
                          checked={formData.roles.includes(role)}
                          onChange={handleChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`modal-role-${role}`}
                          className="ml-3 block text-sm text-gray-700"
                        >
                          {role}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Motivation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Why would you like to volunteer for this event?
                  </label>
                  <textarea
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleChange}
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Share your motivation for volunteering..."
                  />
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Do you have prior volunteering or event experience?
                  </label>
                  <div className="flex space-x-6 mb-3">
                    <div className="flex items-center">
                      <input
                        id="modal-experience-yes"
                        name="experience"
                        type="radio"
                        value="yes"
                        checked={formData.experience === "yes"}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label
                        htmlFor="modal-experience-yes"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Yes
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="modal-experience-no"
                        name="experience"
                        type="radio"
                        value="no"
                        checked={formData.experience === "no"}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label
                        htmlFor="modal-experience-no"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        No
                      </label>
                    </div>
                  </div>
                  {formData.experience === "yes" && (
                    <textarea
                      name="experienceDetails"
                      value={formData.experienceDetails}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Please elaborate on your experience..."
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    disabled={actionLoading === "form"}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    disabled={actionLoading === "form"}
                  >
                    {actionLoading === "form"
                      ? "Saving..."
                      : editingVolunteer
                      ? "Update Volunteer"
                      : "Add Volunteer"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteersAdmin;
